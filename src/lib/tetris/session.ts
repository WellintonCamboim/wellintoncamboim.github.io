import {
  type ActivePiece,
  type Board,
  type Cell,
  PieceQueue,
  clearLines,
  createBoard,
  lockPiece,
  moveHorizontal,
  rotateClockwise,
  softDrop,
  spawnPiece,
} from "./engine";
import { type Move, findBestMove } from "./ai";
import type { Rng } from "./rng";

export interface TetrisSession {
  board: Board;
  queue: PieceQueue;
  // null only right after a "toppedOut" event, while the board is still
  // showing the final stack for the dissolve animation to fade out.
  active: ActivePiece | null;
  target: Move;
}

function spawnNext(board: Board, queue: PieceQueue): TetrisSession {
  const active = spawnPiece(queue.next());
  // Falls back to the spawn position itself in the (extremely unlikely)
  // case findBestMove finds nowhere legal to go — the very next lock
  // attempt below will then see isGameOver and trigger the dissolve.
  const target = findBestMove(board, active.type) ?? { rotation: 0, position: active.position };
  return { board, queue, active, target };
}

export function createSession(rng: Rng): TetrisSession {
  return spawnNext(createBoard(), new PieceQueue(rng));
}

function fullRows(board: Board): number[] {
  const rows: number[] = [];
  for (let y = 0; y < board.length; y++) {
    if (board[y].every((cell: Cell) => cell !== null)) rows.push(y);
  }
  return rows;
}

// The deepest row any piece's 4x4 spawn box can reach is SPAWN_Y + 2 (see
// BASE_SHAPES in engine.ts) — one row deeper than engine.ts's own
// isGameOver, which only looks at SPAWN_Y and SPAWN_Y + 1 and was never
// actually wired into anything before this session. Checking the narrower
// range here could spawn a piece already overlapping a tall stack, so this
// covers every row a spawn could touch instead.
const SPAWN_ZONE_ROWS = [0, 1, 2];

function spawnZoneBlocked(board: Board): boolean {
  return SPAWN_ZONE_ROWS.some((y) => board[y].some((cell) => cell !== null));
}

export type StepEvent =
  | { type: "moved" }
  | { type: "locked"; linesCleared: number; clearedRows: number[] }
  | { type: "toppedOut" };

export interface StepResult {
  session: TetrisSession;
  event: StepEvent;
}

// Advances the active piece by exactly one grid action toward the bot's
// chosen move — rotate, then slide one column, then fall one row — instead
// of interpolating a continuous path. It reuses the same discrete engine
// primitives a turn-by-turn player would use, which is enough to read as
// deliberate, human-paced movement ("não teleporte", section 8) without a
// second animation/physics system. Each of the three checks normally
// succeeds on the first attempt it's reached (rotation at the still-empty
// spawn row, then a clear run to the bot's target column); if one is ever
// blocked — e.g. a near-topped-out board reaching into the piece's upper
// cells — it just falls through to the next action that tick rather than
// getting stuck, the same "reject and move on" tolerance engine.ts already
// has for rotation (see docs/decisions.md, "Tetris (5.1)").
export function step(session: TetrisSession): StepResult {
  const { board, active, target, queue } = session;
  if (!active) {
    return { session, event: { type: "moved" } };
  }

  if (active.rotation !== target.rotation) {
    const rotated = rotateClockwise(board, active.type, active.rotation, active.position);
    if (rotated) {
      return {
        session: { ...session, active: { ...active, rotation: rotated.rotation } },
        event: { type: "moved" },
      };
    }
  }

  if (active.position.x !== target.position.x) {
    const dx = active.position.x < target.position.x ? 1 : -1;
    const moved = moveHorizontal(board, active.type, active.rotation, active.position, dx);
    if (moved) {
      return {
        session: { ...session, active: { ...active, position: moved } },
        event: { type: "moved" },
      };
    }
  }

  const { position, landed } = softDrop(board, active.type, active.rotation, active.position);
  if (!landed) {
    return {
      session: { ...session, active: { ...active, position } },
      event: { type: "moved" },
    };
  }

  const locked = lockPiece(board, active.type, active.rotation, position);
  const clearedRows = fullRows(locked);
  const { board: cleared, linesCleared } = clearLines(locked);

  if (spawnZoneBlocked(cleared)) {
    return {
      session: { ...session, board: cleared, active: null },
      event: { type: "toppedOut" },
    };
  }

  return {
    session: spawnNext(cleared, queue),
    event: { type: "locked", linesCleared, clearedRows },
  };
}

// Called once the "stack too tall" dissolve animation finishes fading the
// board out: wipes it and resumes from the same piece queue/RNG. A reset,
// never a restart — section 8: "nunca mostre game over".
export function resetAfterDissolve(session: TetrisSession): TetrisSession {
  return spawnNext(createBoard(), session.queue);
}
