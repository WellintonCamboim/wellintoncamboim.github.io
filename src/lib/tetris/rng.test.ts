import { describe, expect, it } from "vitest";
import { Rng } from "./rng";

describe("Rng", () => {
  it("is deterministic for a given seed", () => {
    const a = new Rng(42);
    const b = new Rng(42);
    const sequenceA = Array.from({ length: 20 }, () => a.next());
    const sequenceB = Array.from({ length: 20 }, () => b.next());
    expect(sequenceA).toEqual(sequenceB);
  });

  it("produces different sequences for different seeds", () => {
    const a = new Rng(1);
    const b = new Rng(2);
    const sequenceA = Array.from({ length: 10 }, () => a.next());
    const sequenceB = Array.from({ length: 10 }, () => b.next());
    expect(sequenceA).not.toEqual(sequenceB);
  });

  it("always returns a value in [0, 1)", () => {
    const rng = new Rng(7);
    for (let i = 0; i < 500; i++) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("nextInt never returns the upper bound", () => {
    const rng = new Rng(123);
    for (let i = 0; i < 500; i++) {
      const value = rng.nextInt(7);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(7);
    }
  });
});
