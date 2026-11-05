import { Rng } from "./rng";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type PieceType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export const PIECE_TYPES: readonly PieceType[] = ["I", "O", "T", "S", "Z", "J", "L"];

export type Cell = PieceType | null;
export type Board = Cell[][];

export interface Position {
  x: number;
  y: number;
}

export interface ActivePiece {
  type: PieceType;
  rotation: number;
  position: Position;
}

// Each piece's rotation-0 cells, in a 4x4 bounding box (x,y in [0,3]).
const BASE_SHAPES: Record<PieceType, Position[]> = {
  I: [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
  ],
  O: [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ],
  T: [
    { x: 1, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ],
  S: [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
  Z: [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ],
  J: [
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ],
  L: [
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
  ],
};

const SPAWN_X = 3;
const SPAWN_Y = 0;

// 90° clockwise rotation of a point within a 4x4 box. No wall kicks: a
// rotation that would collide is simply rejected by the caller.
function rotateCellClockwise(cell: Position): Position {
  return { x: 3 - cell.y, y: cell.x };
}

export function getPieceCells(type: PieceType, rotation: number): Position[] {
  const normalizedRotation = ((rotation % 4) + 4) % 4;
  let cells = BASE_SHAPES[type];
  for (let i = 0; i < normalizedRotation; i++) {
    cells = cells.map(rotateCellClockwise);
  }
  return cells;
}

export function createBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array<Cell>(BOARD_WIDTH).fill(null));
}

export function spawnPosition(): Position {
  return { x: SPAWN_X, y: SPAWN_Y };
}

export function isValidPosition(board: Board, type: PieceType, rotation: number, position: Position): boolean {
  return getPieceCells(type, rotation).every(({ x, y }) => {
    const boardX = position.x + x;
    const boardY = position.y + y;
    if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
      return false;
    }
    if (boardY < 0) {
      return true;
    }
    return board[boardY][boardX] === null;
  });
}

export function moveHorizontal(
  board: Board,
  type: PieceType,
  rotation: number,
  position: Position,
  dx: -1 | 1,
): Position | null {
  const next = { x: position.x + dx, y: position.y };
  return isValidPosition(board, type, rotation, next) ? next : null;
}

export function rotateClockwise(
  board: Board,
  type: PieceType,
  rotation: number,
  position: Position,
): { rotation: number; position: Position } | null {
  const nextRotation = (rotation + 1) % 4;
  return isValidPosition(board, type, nextRotation, position) ? { rotation: nextRotation, position } : null;
}

export function softDrop(
  board: Board,
  type: PieceType,
  rotation: number,
  position: Position,
): { position: Position; landed: boolean } {
  const next = { x: position.x, y: position.y + 1 };
  if (isValidPosition(board, type, rotation, next)) {
    return { position: next, landed: false };
  }
  return { position, landed: true };
}

export function hardDropPosition(board: Board, type: PieceType, rotation: number, position: Position): Position {
  let current = position;
  while (isValidPosition(board, type, rotation, { x: current.x, y: current.y + 1 })) {
    current = { x: current.x, y: current.y + 1 };
  }
  return current;
}

export function lockPiece(board: Board, type: PieceType, rotation: number, position: Position): Board {
  const next = board.map((row) => row.slice());
  for (const cell of getPieceCells(type, rotation)) {
    const boardX = position.x + cell.x;
    const boardY = position.y + cell.y;
    if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
      next[boardY][boardX] = type;
    }
  }
  return next;
}

export function clearLines(board: Board): { board: Board; linesCleared: number } {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const linesCleared = BOARD_HEIGHT - remaining.length;
  const emptyRows = Array.from({ length: linesCleared }, () => Array<Cell>(BOARD_WIDTH).fill(null));
  return { board: [...emptyRows, ...remaining], linesCleared };
}

export function isGameOver(board: Board): boolean {
  return board[SPAWN_Y].some((cell) => cell !== null) || board[SPAWN_Y + 1]?.some((cell) => cell !== null);
}

export function createBag(rng: Rng): PieceType[] {
  const bag = [...PIECE_TYPES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

export class PieceQueue {
  private rng: Rng;
  private bag: PieceType[] = [];

  constructor(rng: Rng) {
    this.rng = rng;
  }

  next(): PieceType {
    if (this.bag.length === 0) {
      this.bag = createBag(this.rng);
    }
    return this.bag.shift()!;
  }
}

export function spawnPiece(type: PieceType): ActivePiece {
  return { type, rotation: 0, position: spawnPosition() };
}
