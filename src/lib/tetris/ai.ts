import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  type Board,
  type PieceType,
  type Position,
  clearLines,
  hardDropPosition,
  isValidPosition,
  lockPiece,
} from "./engine";

export interface Move {
  rotation: number;
  position: Position;
}

// Classic 4-weight heuristic (see docs/decisions.md and section 8 of the
// project brief): favors clearing lines, penalizes height, holes, and an
// uneven skyline.
const WEIGHT_AGGREGATE_HEIGHT = -0.51;
const WEIGHT_COMPLETE_LINES = 0.76;
const WEIGHT_HOLES = -0.36;
const WEIGHT_BUMPINESS = -0.18;

// Any y comfortably above the board makes every piece cell land at a
// negative board row, which isValidPosition always treats as free — so this
// probes column/rotation legality (board bounds only) independently of how
// tall the current stack is.
const PROBE_Y = -BOARD_HEIGHT;

function columnHeights(board: Board): number[] {
  const heights = new Array<number>(BOARD_WIDTH).fill(0);
  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (board[y][x] !== null) {
        heights[x] = BOARD_HEIGHT - y;
        break;
      }
    }
  }
  return heights;
}

export function countHoles(board: Board): number {
  let holes = 0;
  for (let x = 0; x < BOARD_WIDTH; x++) {
    let blockFound = false;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (board[y][x] !== null) {
        blockFound = true;
      } else if (blockFound) {
        holes++;
      }
    }
  }
  return holes;
}

function bumpiness(heights: number[]): number {
  let total = 0;
  for (let x = 0; x < heights.length - 1; x++) {
    total += Math.abs(heights[x] - heights[x + 1]);
  }
  return total;
}

export function scorePlacement(board: Board, linesCleared: number): number {
  const heights = columnHeights(board);
  const aggregateHeight = heights.reduce((sum, h) => sum + h, 0);
  return (
    WEIGHT_AGGREGATE_HEIGHT * aggregateHeight +
    WEIGHT_COMPLETE_LINES * linesCleared +
    WEIGHT_HOLES * countHoles(board) +
    WEIGHT_BUMPINESS * bumpiness(heights)
  );
}

// Tries every rotation and every reachable column, hard-drops each
// virtually, and scores the resulting board. Returns the best-scoring
// landing spot, or null if the piece has nowhere legal to go (board full).
export function findBestMove(board: Board, type: PieceType): Move | null {
  let best: Move | null = null;
  let bestScore = -Infinity;

  for (let rotation = 0; rotation < 4; rotation++) {
    for (let x = -3; x < BOARD_WIDTH; x++) {
      const probe: Position = { x, y: PROBE_Y };
      if (!isValidPosition(board, type, rotation, probe)) continue;

      const landed = hardDropPosition(board, type, rotation, probe);
      const locked = lockPiece(board, type, rotation, landed);
      const { board: cleared, linesCleared } = clearLines(locked);
      const score = scorePlacement(cleared, linesCleared);

      if (score > bestScore) {
        bestScore = score;
        best = { rotation, position: landed };
      }
    }
  }

  return best;
}
