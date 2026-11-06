import { describe, expect, it } from "vitest";
import { PIECE_TYPES } from "./engine";
import { PIECE_CATEGORY, cellRect, pieceColorVar } from "./renderer";

describe("PIECE_CATEGORY", () => {
  it("maps every piece type to one of the 5 skill-highlight categories", () => {
    const validCategories = ["frontend", "backend", "cloud", "ai", "domain"];
    for (const type of PIECE_TYPES) {
      expect(validCategories).toContain(PIECE_CATEGORY[type]);
    }
  });

  it("covers all 5 categories across the 7 piece types", () => {
    const categories = new Set(PIECE_TYPES.map((type) => PIECE_CATEGORY[type]));
    expect(categories.size).toBe(5);
  });
});

describe("pieceColorVar", () => {
  it("resolves to --accent for the AI category and a skill-* variable otherwise", () => {
    for (const type of PIECE_TYPES) {
      const varName = pieceColorVar(type);
      if (PIECE_CATEGORY[type] === "ai") {
        expect(varName).toBe("--accent");
      } else {
        expect(varName).toMatch(/^--skill-/);
      }
    }
  });
});

describe("cellRect", () => {
  it("places adjacent cells without overlap, inset by the gap", () => {
    const cellSize = 24;
    const a = cellRect(2, 3, cellSize);
    const b = cellRect(3, 3, cellSize);
    expect(a.x).toBeLessThan(b.x);
    expect(a.x + a.width).toBeLessThanOrEqual(b.x);
  });

  it("keeps the cell within its grid square, centered by the gap", () => {
    const cellSize = 20;
    const gap = 4;
    const rect = cellRect(1, 1, cellSize, gap);
    expect(rect.x).toBe(1 * cellSize + gap / 2);
    expect(rect.y).toBe(1 * cellSize + gap / 2);
    expect(rect.width).toBe(cellSize - gap);
    expect(rect.height).toBe(cellSize - gap);
  });
});
