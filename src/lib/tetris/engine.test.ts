import { describe, expect, it } from "vitest";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  PIECE_TYPES,
  PieceQueue,
  clearLines,
  createBag,
  createBoard,
  getPieceCells,
  hardDropPosition,
  isValidPosition,
  lockPiece,
  moveHorizontal,
  rotateClockwise,
  softDrop,
  spawnPosition,
} from "./engine";
import { Rng } from "./rng";

describe("createBoard", () => {
  it("creates an empty 10x20 board", () => {
    const board = createBoard();
    expect(board).toHaveLength(BOARD_HEIGHT);
    expect(board[0]).toHaveLength(BOARD_WIDTH);
    expect(board.every((row) => row.every((cell) => cell === null))).toBe(true);
  });
});

describe("getPieceCells", () => {
  it("returns exactly 4 cells for every piece and rotation", () => {
    for (const type of PIECE_TYPES) {
      for (let rotation = 0; rotation < 4; rotation++) {
        expect(getPieceCells(type, rotation)).toHaveLength(4);
      }
    }
  });

  it("normalizes rotation values outside 0-3", () => {
    expect(getPieceCells("T", 4)).toEqual(getPieceCells("T", 0));
    expect(getPieceCells("T", -1)).toEqual(getPieceCells("T", 3));
  });
});

describe("isValidPosition / moveHorizontal (collision and bounds)", () => {
  it("rejects a position past the left wall", () => {
    const board = createBoard();
    expect(isValidPosition(board, "I", 0, { x: -1, y: 1 })).toBe(false);
  });

  it("rejects a position past the right wall", () => {
    const board = createBoard();
    // I at rotation 0 occupies columns x..x+3; x=7 pushes the last cell to column 10 (out of bounds).
    expect(isValidPosition(board, "I", 0, { x: 7, y: 1 })).toBe(false);
  });

  it("rejects a position below the floor", () => {
    const board = createBoard();
    expect(isValidPosition(board, "I", 0, { x: 3, y: BOARD_HEIGHT - 1 })).toBe(false);
  });

  it("rejects a position overlapping an occupied cell", () => {
    const board = createBoard();
    board[1][3] = "O"; // row 1, column 3
    // I at rotation 0, position {x:0,y:0} occupies row 1, columns 0-3 — overlaps column 3.
    expect(isValidPosition(board, "I", 0, { x: 0, y: 0 })).toBe(false);
    // Same shape a few rows down is clear of the occupied cell.
    expect(isValidPosition(board, "I", 0, { x: 0, y: 5 })).toBe(true);
  });

  it("moveHorizontal returns null when blocked by the right wall", () => {
    const board = createBoard();
    expect(moveHorizontal(board, "I", 0, { x: 6, y: 1 }, 1)).toBeNull();
  });

  it("moveHorizontal returns the shifted position when free", () => {
    const board = createBoard();
    expect(moveHorizontal(board, "I", 0, { x: 3, y: 1 }, 1)).toEqual({ x: 4, y: 1 });
  });
});

describe("rotateClockwise", () => {
  it("rotates into a free position", () => {
    const board = createBoard();
    const result = rotateClockwise(board, "T", 0, { x: 3, y: 0 });
    expect(result).toEqual({ rotation: 1, position: { x: 3, y: 0 } });
  });

  it("rejects a rotation that would overlap an occupied cell", () => {
    const board = createBoard();
    // T at rotation 1, position {x:3,y:0} occupies (5,1) among others — block it.
    board[1][5] = "O";
    expect(rotateClockwise(board, "T", 0, { x: 3, y: 0 })).toBeNull();
  });
});

describe("softDrop / hardDropPosition (gravity)", () => {
  it("softDrop moves the piece down by one row when free", () => {
    const board = createBoard();
    expect(softDrop(board, "I", 0, { x: 3, y: 1 })).toEqual({ position: { x: 3, y: 2 }, landed: false });
  });

  it("softDrop reports landed when the piece reaches the floor", () => {
    const board = createBoard();
    const position = { x: 3, y: BOARD_HEIGHT - 2 };
    expect(softDrop(board, "I", 0, position)).toEqual({ position, landed: true });
  });

  it("hardDropPosition drops straight to the floor on an empty board", () => {
    const board = createBoard();
    const position = hardDropPosition(board, "I", 0, spawnPosition());
    // I at rotation 0 occupies row y+1, so y+1 must be the bottom row.
    expect(position.y).toBe(BOARD_HEIGHT - 2);
  });

  it("hardDropPosition stops on top of the stack", () => {
    const board = createBoard();
    board[BOARD_HEIGHT - 1][3] = "O";
    const position = hardDropPosition(board, "O", 0, { x: 2, y: 0 });
    // O at rotation 0 occupies rows y+1 and y+2 at columns 3-4; it must stop
    // with its bottom row (y+2) resting just above the occupied bottom row.
    expect(position.y).toBe(BOARD_HEIGHT - 4);
  });
});

describe("lockPiece and clearLines", () => {
  it("writes the piece's cells into the board", () => {
    const board = createBoard();
    // I at rotation 0 has its row at offset y=1, so position {x:3,y:1} lands on board row 2.
    const locked = lockPiece(board, "I", 0, { x: 3, y: 1 });
    expect(locked[2][3]).toBe("I");
    expect(locked[2][6]).toBe("I");
    expect(board[2][3]).toBeNull(); // original board untouched
  });

  it("clears multiple full lines and shifts the rest down", () => {
    const board = createBoard();
    board[19] = Array(BOARD_WIDTH).fill("I");
    board[17] = Array(BOARD_WIDTH).fill("T");
    board[18] = Array(BOARD_WIDTH).fill(null);
    board[18][5] = "O";

    const { board: cleared, linesCleared } = clearLines(board);

    expect(linesCleared).toBe(2);
    expect(cleared).toHaveLength(BOARD_HEIGHT);
    expect(cleared[19]).toEqual(board[18]);
    expect(cleared[0]).toEqual(Array(BOARD_WIDTH).fill(null));
    expect(cleared[1]).toEqual(Array(BOARD_WIDTH).fill(null));
  });

  it("clears nothing when no line is full", () => {
    const board = createBoard();
    board[19][0] = "L";
    const { board: cleared, linesCleared } = clearLines(board);
    expect(linesCleared).toBe(0);
    expect(cleared).toEqual(board);
  });
});

describe("7-bag randomizer", () => {
  it("each bag contains every piece type exactly once", () => {
    const rng = new Rng(99);
    for (let i = 0; i < 20; i++) {
      const bag = createBag(rng);
      expect([...bag].sort()).toEqual([...PIECE_TYPES].sort());
    }
  });

  it("PieceQueue never produces an invalid piece type and respects bag boundaries", () => {
    const queue = new PieceQueue(new Rng(7));
    const pieces = Array.from({ length: 21 }, () => queue.next());
    for (let bagStart = 0; bagStart < pieces.length; bagStart += 7) {
      const bag = pieces.slice(bagStart, bagStart + 7);
      expect([...bag].sort()).toEqual([...PIECE_TYPES].sort());
    }
  });

  it("is deterministic for a given seed", () => {
    const a = new PieceQueue(new Rng(2024));
    const b = new PieceQueue(new Rng(2024));
    const sequenceA = Array.from({ length: 30 }, () => a.next());
    const sequenceB = Array.from({ length: 30 }, () => b.next());
    expect(sequenceA).toEqual(sequenceB);
  });
});
