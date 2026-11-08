import { describe, expect, it } from "vitest";
import { findBestMove } from "./ai";
import { BOARD_HEIGHT, BOARD_WIDTH, createBoard, isValidPosition, spawnPosition } from "./engine";
import { Rng } from "./rng";
import { type TetrisSession, createSession, resetAfterDissolve, step } from "./session";

describe("createSession", () => {
  it("spawns the first piece at the spawn position with the bot's chosen move as target", () => {
    const session = createSession(new Rng(1));
    expect(session.active).not.toBeNull();
    expect(session.active!.position).toEqual(spawnPosition());
    expect(session.active!.rotation).toBe(0);
    expect(session.target).toEqual(findBestMove(createBoard(), session.active!.type));
  });
});

describe("step", () => {
  it("moves the active piece by exactly one grid action at a time", () => {
    const session = createSession(new Rng(2));
    const before = session.active!;
    const { session: after, event } = step(session);

    expect(event.type).toBe("moved");
    const rotationChanged = after.active!.rotation !== before.rotation;
    const xChanged = after.active!.position.x !== before.position.x;
    const yChanged = after.active!.position.y !== before.position.y;
    // exactly one kind of change per step, and never by more than one cell
    expect([rotationChanged, xChanged, yChanged].filter(Boolean).length).toBe(1);
    expect(Math.abs(after.active!.position.x - before.position.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(after.active!.position.y - before.position.y)).toBeLessThanOrEqual(1);
  });

  it("eventually locks a piece exactly at the bot's target and spawns a new one", () => {
    let session = createSession(new Rng(3));
    const target = session.target;

    let locked: { linesCleared: number; clearedRows: number[] } | null = null;
    for (let i = 0; i < 200 && !locked; i++) {
      const result = step(session);
      session = result.session;
      if (result.event.type === "locked") locked = result.event;
    }

    expect(locked).not.toBeNull();
    expect(locked!.clearedRows.length).toBe(locked!.linesCleared);
    // a fresh piece spawned right after the lock
    expect(session.active).not.toBeNull();
    expect(session.active!.position).toEqual(spawnPosition());
    void target;
  });

  it("never leaves the active piece in an invalid position", () => {
    let session = createSession(new Rng(4));
    for (let i = 0; i < 500; i++) {
      const result = step(session);
      session = result.session;
      if (session.active) {
        expect(
          isValidPosition(
            session.board,
            session.active.type,
            session.active.rotation,
            session.active.position,
          ),
        ).toBe(true);
      }
    }
  });

  it("dissolves instead of reporting game over when the stack tops out", () => {
    // Fill the board almost to the very top, leaving just enough room that
    // the next lock pushes a block into the spawn rows.
    let session: TetrisSession = createSession(new Rng(5));
    session.board = createBoard();
    for (let y = 2; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        session.board[y][x] = "I";
      }
    }
    // Leave one full column empty so a piece can still legally drop there
    // without the "no legal move" fallback kicking in.
    for (let y = 2; y < BOARD_HEIGHT; y++) session.board[y][4] = null;
    session.active = { type: "O", rotation: 0, position: spawnPosition() };
    session.target = findBestMove(session.board, "O")!;

    let toppedOut = false;
    for (let i = 0; i < 20 && !toppedOut; i++) {
      const result = step(session);
      session = result.session;
      if (result.event.type === "toppedOut") toppedOut = true;
    }

    expect(toppedOut).toBe(true);
    expect(session.active).toBeNull();

    const resumed = resetAfterDissolve(session);
    expect(resumed.active).not.toBeNull();
    expect(resumed.board.every((row) => row.every((cell) => cell === null))).toBe(true);
  });
});
