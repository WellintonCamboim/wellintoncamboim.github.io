import { BOARD_HEIGHT, BOARD_WIDTH, type ActivePiece, type Board, type PieceType, getPieceCells } from "./engine";
import type { HighlightCategoryId } from "@/content/skills";

// Reuses the 5 skill-category colors already defined for the Skills section
// (see docs/decisions.md, "Skills (4.3): cor por categoria de destaque" — that
// ADR explicitly reserved these tokens for Tetris reuse) instead of the 7
// categories literally listed in the project brief's section 8. 7 piece
// types onto 5 categories means frontend and backend — the two biggest
// categories in Skills — cover 2 piece types each; the rest cover 1. See
// docs/decisions.md ("Tetris (5.3)") for the full rationale.
export const PIECE_CATEGORY: Record<PieceType, HighlightCategoryId> = {
  I: "frontend",
  L: "frontend",
  O: "backend",
  J: "backend",
  T: "cloud",
  S: "ai",
  Z: "domain",
};

const CATEGORY_CSS_VAR: Record<HighlightCategoryId, string> = {
  frontend: "--skill-frontend",
  backend: "--skill-backend",
  cloud: "--skill-cloud",
  ai: "--accent",
  domain: "--skill-domain",
};

export function pieceColorVar(type: PieceType): string {
  return CATEGORY_CSS_VAR[PIECE_CATEGORY[type]];
}

export interface CellRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Pure geometry: the pixel rect a board cell occupies, with a small gap so
// locked/falling blocks read as distinct cells rather than a solid mass.
export function cellRect(column: number, row: number, cellSize: number, gap = Math.max(1, cellSize * 0.08)): CellRect {
  return {
    x: column * cellSize + gap / 2,
    y: row * cellSize + gap / 2,
    width: cellSize - gap,
    height: cellSize - gap,
  };
}

export interface RenderTheme {
  background: string;
  grid: string;
  accent: string;
  pieceColors: Record<PieceType, string>;
}

const PIECE_TYPES_FOR_THEME: PieceType[] = ["I", "O", "T", "S", "Z", "J", "L"];

// Reads resolved colors from the live CSS custom properties so the board
// repaints correctly after a theme switch — the renderer never hardcodes a
// color itself (section 6 of the brief).
export function readTheme(root: Element = document.documentElement): RenderTheme {
  const style = getComputedStyle(root);
  const read = (name: string) => style.getPropertyValue(name).trim();
  const pieceColors = Object.fromEntries(
    PIECE_TYPES_FOR_THEME.map((type) => [type, read(pieceColorVar(type))]),
  ) as Record<PieceType, string>;
  return {
    background: read("--surface"),
    grid: read("--border"),
    accent: read("--accent"),
    pieceColors,
  };
}

function roundedRectPath(ctx: CanvasRenderingContext2D, rect: CellRect, radius: number) {
  const { x, y, width, height } = rect;
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawCell(ctx: CanvasRenderingContext2D, column: number, row: number, color: string, cellSize: number, alpha = 1) {
  const rect = cellRect(column, row, cellSize);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = color;
  ctx.shadowBlur = cellSize * 0.25;
  ctx.fillStyle = color;
  roundedRectPath(ctx, rect, cellSize * 0.18);
  ctx.fill();
  // Subtle top highlight so blocks read as lit from above rather than flat.
  ctx.shadowBlur = 0;
  ctx.globalAlpha = alpha * 0.25;
  ctx.fillStyle = "#ffffff";
  roundedRectPath(ctx, { ...rect, height: rect.height * 0.4 }, cellSize * 0.18);
  ctx.fill();
  ctx.restore();
}

export interface LineClearEffect {
  rows: number[];
  // 0 = just triggered, 1 = fully faded; caller advances this over ~250-400ms.
  progress: number;
}

function drawLineClearFlash(
  ctx: CanvasRenderingContext2D,
  effect: LineClearEffect,
  cellSize: number,
  accentColor: string,
) {
  const fade = 1 - effect.progress;
  if (fade <= 0) return;
  const width = BOARD_WIDTH * cellSize;

  ctx.save();
  ctx.globalAlpha = fade * 0.8;
  ctx.fillStyle = "#ffffff";
  for (const row of effect.rows) {
    ctx.fillRect(0, row * cellSize, width, cellSize);
  }

  // A brighter band sweeps left-to-right across the clearing rows.
  const waveX = effect.progress * width;
  ctx.globalAlpha = Math.min(1, fade + 0.2);
  ctx.fillStyle = accentColor;
  for (const row of effect.rows) {
    ctx.fillRect(Math.max(0, waveX - cellSize), row * cellSize, cellSize * 0.75, cellSize);
  }
  ctx.restore();
}

export interface DrawBoardOptions {
  // 0 = normal, 1 = fully dissolved — used for the "stack too tall" reset,
  // never a game-over state (section 8: "nunca mostre game over").
  dissolveProgress?: number;
  lineClear?: LineClearEffect;
}

export function drawBoard(
  ctx: CanvasRenderingContext2D,
  board: Board,
  theme: RenderTheme,
  cellSize: number,
  options: DrawBoardOptions = {},
) {
  const width = BOARD_WIDTH * cellSize;
  const height = BOARD_HEIGHT * cellSize;
  const dissolveAlpha = 1 - (options.dissolveProgress ?? 0);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = theme.grid;
  ctx.lineWidth = 1;
  for (let column = 0; column <= BOARD_WIDTH; column++) {
    ctx.beginPath();
    ctx.moveTo(column * cellSize, 0);
    ctx.lineTo(column * cellSize, height);
    ctx.stroke();
  }
  for (let row = 0; row <= BOARD_HEIGHT; row++) {
    ctx.beginPath();
    ctx.moveTo(0, row * cellSize);
    ctx.lineTo(width, row * cellSize);
    ctx.stroke();
  }

  for (let row = 0; row < BOARD_HEIGHT; row++) {
    for (let column = 0; column < BOARD_WIDTH; column++) {
      const cell = board[row][column];
      if (cell) drawCell(ctx, column, row, theme.pieceColors[cell], cellSize, dissolveAlpha);
    }
  }

  if (options.lineClear) {
    drawLineClearFlash(ctx, options.lineClear, cellSize, theme.accent);
  }
}

export function drawActivePiece(ctx: CanvasRenderingContext2D, piece: ActivePiece, theme: RenderTheme, cellSize: number) {
  const color = theme.pieceColors[piece.type];
  for (const cell of getPieceCells(piece.type, piece.rotation)) {
    const row = piece.position.y + cell.y;
    const column = piece.position.x + cell.x;
    if (row < 0) continue; // still above the board, nothing to paint yet
    drawCell(ctx, column, row, color, cellSize);
  }
}

export interface RenderFrameParams {
  board: Board;
  activePiece?: ActivePiece | null;
  theme: RenderTheme;
  cellSize: number;
  dissolveProgress?: number;
  lineClear?: LineClearEffect;
}

export function renderFrame(ctx: CanvasRenderingContext2D, params: RenderFrameParams) {
  drawBoard(ctx, params.board, params.theme, params.cellSize, {
    dissolveProgress: params.dissolveProgress,
    lineClear: params.lineClear,
  });
  if (params.activePiece) {
    drawActivePiece(ctx, params.activePiece, params.theme, params.cellSize);
  }
}
