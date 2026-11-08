"use client";

import { useEffect, useRef } from "react";
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

// One grid action (rotate, slide one column, or fall one row) per tick —
// human-paced, not instant, per session.ts's step(). See docs/decisions.md,
// "Tetris (5.4)".
const STEP_INTERVAL_MS = 90;
const LINE_CLEAR_DURATION_MS = 320;
const DISSOLVE_DURATION_MS = 700;
const MIN_CELL_SIZE = 10;
const MAX_CELL_SIZE = 48;

export function TetrisCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      // Contain-fit within whatever box the caller gives this component —
      // a small centered panel (width-constrained, height 0/auto) and a
      // full-bleed backdrop (both dimensions constrained) both work.
      const widthBasedSize = container.clientWidth / BOARD_WIDTH;
      const heightBasedSize =
        container.clientHeight > 0 ? container.clientHeight / BOARD_HEIGHT : Infinity;
      cellSize = Math.max(MIN_CELL_SIZE, Math.min(MAX_CELL_SIZE, widthBasedSize, heightBasedSize));
      const cssWidth = cellSize * BOARD_WIDTH;
      const cssHeight = cellSize * BOARD_HEIGHT;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      // Resizing width/height resets the canvas's transform, so this must
      // run again every time — it's not a one-off setup step.
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

    resize();
    draw();

    // Keeps the canvas crisp (devicePixelRatio) and correctly sized as the
    // hero's layout responds to viewport width.
    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(container);

    // Only runs the rAF loop while the board is actually on screen — the
    // accessible pause control, reduced-motion handling, and the
    // document.hidden case are 5.5's job (see docs/decisions.md).
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startLoop();
        else stopLoop();
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

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="flex size-full items-center justify-center">
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none block rounded-lg" />
    </div>
  );
}
