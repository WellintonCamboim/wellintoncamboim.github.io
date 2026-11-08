"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Pause, Play } from "lucide-react";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  Rng,
  createSession,
  readTheme,
  renderFrame,
  resetAfterDissolve,
  step,
  type LineClearEffect,
  type RenderTheme,
  type TetrisSession,
} from "@/lib/tetris";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

// One grid action (rotate, slide one column, or fall one row) per tick —
// human-paced, not instant, per session.ts's step(). See docs/decisions.md,
// "Tetris (5.4)".
const STEP_INTERVAL_MS = 90;
const LINE_CLEAR_DURATION_MS = 320;
const DISSOLVE_DURATION_MS = 700;
const MIN_CELL_SIZE = 10;
const MAX_CELL_SIZE = 48;
// Enough synchronous step() calls to lock a handful of pieces before the
// first paint, so the prefers-reduced-motion static frame shows a settled
// board instead of an empty one (section 8: "quadro estático bonito").
const STATIC_PREVIEW_STEPS = 600;

// Picks a fresh raster resolution (resize() below) synchronously before
// the browser paints, instead of after — avoids a one-frame flash of the
// previous resolution on viewport/orientation changes. Doesn't affect the
// canvas's CSS box size (fixed by markup, see the JSX below), which is
// what Lighthouse's CLS 0.409 (6.3) actually came from. SSR has no layout
// to measure, so this falls back to useEffect there to avoid React's
// "useLayoutEffect does nothing on the server" warning.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function TetrisCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Bridges the click handler below to the imperative loop set up inside
  // the mount effect, without tearing the session down on every toggle.
  const setRunningRef = useRef<(running: boolean) => void>(() => {});

  const t = useTranslations("tetris");
  const hydrated = useHydrated();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [manualOverride, setManualOverride] = useState<boolean | null>(null);
  const paused = manualOverride ?? prefersReducedMotion;

  useIsomorphicLayoutEffect(() => {
    const containerEl = containerRef.current;
    const canvasEl = canvasRef.current;
    if (!containerEl || !canvasEl) return;

    const ctx2d = canvasEl.getContext("2d");
    if (!ctx2d) return;

    // Narrowed, non-null bindings: TS doesn't carry the null checks above
    // into the nested functions below (they could, in principle, run after
    // a reassignment), so this makes the non-null-ness explicit once.
    const container: HTMLDivElement = containerEl;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctx2d;

    let session: TetrisSession = createSession(new Rng(Date.now()));
    let theme: RenderTheme = readTheme();
    let cellSize = MIN_CELL_SIZE;

    let rafId: number | null = null;
    let lastFrameTime: number | null = null;
    let stepAccumulator = 0;
    let lineClear: LineClearEffect | null = null;
    let lineClearElapsed = 0;
    let dissolving = false;
    let dissolveElapsed = 0;

    // Starts running; the effect below (driven by the `paused` prop, which
    // already accounts for prefers-reduced-motion) corrects this right
    // after mount via setRunningRef, in the same effect flush.
    let manuallyPaused = false;
    let tabHidden = document.hidden;
    let offscreen = false;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (let i = 0; i < STATIC_PREVIEW_STEPS; i++) {
        const result = step(session);
        session = result.session;
        if (result.event.type === "toppedOut") {
          session = resetAfterDissolve(session);
        }
      }
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      // The canvas's CSS box is pinned to the container's full size from
      // the server-rendered markup (`size-full` + `object-contain` below,
      // with a 1:2 `width`/`height` attribute default) — that's what the
      // browser paints before any JS runs, so there's nothing to correct
      // into place here and no layout shift (CLS) once this runs. This
      // only picks a raster resolution close to the box's actual rendered
      // size, for crispness; `object-contain` does the letterboxing.
      const widthBasedSize = container.clientWidth / BOARD_WIDTH;
      const heightBasedSize =
        container.clientHeight > 0 ? container.clientHeight / BOARD_HEIGHT : Infinity;
      cellSize = Math.max(MIN_CELL_SIZE, Math.min(MAX_CELL_SIZE, widthBasedSize, heightBasedSize));
      const cssWidth = cellSize * BOARD_WIDTH;
      const cssHeight = cellSize * BOARD_HEIGHT;
      // Changing width/height resets the canvas's transform, so this must
      // run again every time — it's not a one-off setup step. Both keep
      // the same BOARD_WIDTH:BOARD_HEIGHT ratio as the JSX defaults below,
      // so `object-contain`'s letterboxing never jumps when this fires.
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      renderFrame(ctx, {
        board: session.board,
        activePiece: session.active,
        theme,
        cellSize,
        dissolveProgress: dissolving ? Math.min(1, dissolveElapsed / DISSOLVE_DURATION_MS) : 0,
        lineClear: lineClear ?? undefined,
      });
    }

    function advance(deltaMs: number) {
      if (lineClear) {
        lineClearElapsed += deltaMs;
        const progress = Math.min(1, lineClearElapsed / LINE_CLEAR_DURATION_MS);
        lineClear = progress >= 1 ? null : { ...lineClear, progress };
      }

      if (dissolving) {
        dissolveElapsed += deltaMs;
        if (dissolveElapsed >= DISSOLVE_DURATION_MS) {
          session = resetAfterDissolve(session);
          dissolving = false;
          dissolveElapsed = 0;
          stepAccumulator = 0;
        }
        return;
      }

      stepAccumulator += deltaMs;
      while (stepAccumulator >= STEP_INTERVAL_MS) {
        stepAccumulator -= STEP_INTERVAL_MS;
        const result = step(session);
        session = result.session;
        if (result.event.type === "locked" && result.event.linesCleared > 0) {
          lineClear = { rows: result.event.clearedRows, progress: 0 };
          lineClearElapsed = 0;
        } else if (result.event.type === "toppedOut") {
          dissolving = true;
          dissolveElapsed = 0;
          return;
        }
      }
    }

    function tick(time: number) {
      rafId = requestAnimationFrame(tick);
      const delta = lastFrameTime === null ? 0 : time - lastFrameTime;
      lastFrameTime = time;
      advance(delta);
      draw();
    }

    function startLoop() {
      if (rafId !== null) return;
      lastFrameTime = null;
      rafId = requestAnimationFrame(tick);
    }

    function stopLoop() {
      if (rafId === null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    // Three independent reasons to not be running — manual pause,
    // backgrounded tab, and off-screen — combined so that, e.g., coming
    // back into the viewport never overrides a manual pause.
    function evaluateRunning() {
      if (!manuallyPaused && !tabHidden && !offscreen) startLoop();
      else stopLoop();
    }

    setRunningRef.current = (running) => {
      manuallyPaused = !running;
      evaluateRunning();
    };

    resize();
    draw();
    evaluateRunning();

    // Keeps the canvas crisp (devicePixelRatio) and correctly sized as the
    // hero's layout responds to viewport width.
    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        offscreen = !entry.isIntersecting;
        evaluateRunning();
      },
      { threshold: 0.1 },
    );
    intersectionObserver.observe(container);

    // Re-reads the theme's CSS variables only when the theme actually
    // changes, instead of every frame (section 8: no hot-loop allocations).
    const themeObserver = new MutationObserver(() => {
      theme = readTheme();
      draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    function handleVisibilityChange() {
      tabHidden = document.hidden;
      evaluateRunning();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Applies the pause button's state (which already folds in
  // prefers-reduced-motion as its initial default) to the loop set up
  // above. Runs once more right after mount, in the same effect flush as
  // the effect above, correcting the "starts running" default when needed.
  useEffect(() => {
    setRunningRef.current(!paused);
  }, [paused]);

  return (
    <div ref={containerRef} className="relative size-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15 [container-type:size]"
      >
        {/* `object-fit` has no effect on <canvas> in Chromium (accepted by
            CSS, ignored when painting) — contain-fit has to come from the
            box's own size instead. `aspect-[1/2]` matches
            BOARD_WIDTH:BOARD_HEIGHT; `min(100cqw,50cqh)` is the same
            width-vs-height-bound contain-fit math resize() below does in
            JS, done in CSS so it's already correct on first paint (see
            "Tetris (5.3)" decision in docs/decisions.md for the 6.3 CLS
            fix history). */}
        <canvas
          ref={canvasRef}
          width={BOARD_WIDTH}
          height={BOARD_HEIGHT}
          className="block aspect-[1/2] w-[min(100cqw,50cqh)] rounded-lg"
        />
      </div>
      <button
        type="button"
        onClick={() => setManualOverride(!paused)}
        aria-pressed={hydrated && paused}
        aria-label={paused ? t("resume") : t("pause")}
        className="absolute right-3 bottom-3 z-20 inline-flex size-9 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:bg-surface/80"
      >
        {hydrated &&
          (paused ? (
            <Play aria-hidden="true" className="size-4" />
          ) : (
            <Pause aria-hidden="true" className="size-4" />
          ))}
      </button>
    </div>
  );
}
