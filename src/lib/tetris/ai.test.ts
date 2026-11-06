import { describe, expect, it } from "vitest";
import { countHoles, findBestMove, scorePlacement } from "./ai";
import { BOARD_HEIGHT, BOARD_WIDTH, PIECE_TYPES, PieceQueue, clearLines, createBoard, isValidPosition, lockPiece } from "./engine";
import { Rng } from "./rng";

describe("scorePlacement (heuristic)", () => {
  it("penalizes a board with a hole versus an equivalent board without one", () => {
    const withHole = createBoard();
    withHole[BOARD_HEIGHT - 1] = Array(BOARD_WIDTH).fill("I");
    withHole[BOARD_HEIGHT - 1][5] = null; // hole: empty cell under a filled one
    withHole[BOARD_HEIGHT - 2][5] = "I";

    const withoutHole = createBoard();
    withoutHole[BOARD_HEIGHT - 1] = Array(BOARD_WIDTH).fill("I");
    withoutHole[BOARD_HEIGHT - 2][5] = "I";

    expect(scorePlacement(withHole, 0)).toBeLessThan(scorePlacement(withoutHole, 0));
  });

  it("rewards clearing lines", () => {
    const board = createBoard();
    expect(scorePlacement(board, 1)).toBeGreaterThan(scorePlacement(board, 0));
  });

  it("penalizes a taller, bumpier skyline over a flatter one at the same cell count", () => {
    const flat = createBoard();
    flat[BOARD_HEIGHT - 1] = Array(BOARD_WIDTH).fill("I");

    const bumpy = createBoard();
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (x % 2 === 0) bumpy[BOARD_HEIGHT - 1][x] = "I";
    }
    for (let x = 1; x < BOARD_WIDTH; x += 2) {
      bumpy[BOARD_HEIGHT - 1][x] = "I";
      bumpy[BOARD_HEIGHT - 2][x] = "I";
    }

    expect(scorePlacement(flat, 0)).toBeGreaterThan(scorePlacement(bumpy, 0));
  });
});

describe("findBestMove", () => {
  it("always returns a position that is valid for the piece", () => {
    const board = createBoard();
    for (const type of PIECE_TYPES) {
      const move = findBestMove(board, type);
      expect(move).not.toBeNull();
      expect(isValidPosition(board, type, move!.rotation, move!.position)).toBe(true);
    }
  });

  it("avoids creating a new hole when a hole-free alternative exists", () => {
    // A flat floor with a single-column well at x=5. The O piece (2 cells
    // wide) can't fill a 1-wide well without creating a hole, so the best
    // move should stack flat elsewhere and leave the well untouched instead.
    const board = createBoard();
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (x === 5) continue;
      board[BOARD_HEIGHT - 1][x] = "I";
    }

    const move = findBestMove(board, "O");
    expect(move).not.toBeNull();
    const locked = lockPiece(board, "O", move!.rotation, move!.position);
    expect(countHoles(locked)).toBe(0);
  });

  it("never produces an invalid move and clears a healthy share of lines over many pieces", () => {
    let board = createBoard();
    const queue = new PieceQueue(new Rng(2024));
    let totalLines = 0;
    const PIECE_COUNT = 300;

    for (let i = 0; i < PIECE_COUNT; i++) {
      const type = queue.next();
      const move = findBestMove(board, type);
      expect(move).not.toBeNull();
      expect(isValidPosition(board, type, move!.rotation, move!.position)).toBe(true);

      const locked = lockPiece(board, type, move!.rotation, move!.position);
      const { board: cleared, linesCleared } = clearLines(locked);
      board = cleared;
      totalLines += linesCleared;
    }

    expect(totalLines).toBeGreaterThanOrEqual(80);
  });
});
