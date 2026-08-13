import { describe, it } from "node:test";
import assert from "node:assert";
import { calculateRank, getRankTitle } from "../apis/trophy.js";

describe("Trophy - getRankTitle", () => {
  it("should return correct title for Stars category", () => {
    assert.strictEqual(getRankTitle("SSS", "Stars"), "Legendary Project");
    assert.strictEqual(getRankTitle("SS", "Stars"), "Superstar");
    assert.strictEqual(getRankTitle("S", "Stars"), "Acclaimed");
    assert.strictEqual(getRankTitle("A", "Stars"), "Popular");
  });

  it("should return correct title for Commits category", () => {
    assert.strictEqual(getRankTitle("SSS", "Commits"), "Relentless Coder");
    assert.strictEqual(getRankTitle("SS", "Commits"), "Commit Machine");
  });

  it("should return Rookie for unknown category", () => {
    assert.strictEqual(getRankTitle("S", "UnknownCategory"), "Rookie");
  });
});

describe("Trophy - calculateRank", () => {
  const thresholds = {
    SSS: 100000,
    SS: 50000,
    S: 10000,
    A: 2000,
    B: 400,
    C: 80,
    D: 1,
  };

  it("should calculate SSS rank (max level)", () => {
    const result = calculateRank(150000, thresholds, "Stars");
    assert.strictEqual(result.rank, "SSS");
    assert.strictEqual(result.next, null);
    assert.strictEqual(result.progress, 100);
    assert.ok(result.title);
  });

  it("should calculate SS rank", () => {
    const result = calculateRank(75000, thresholds, "Stars");
    assert.strictEqual(result.rank, "SS");
    assert.strictEqual(result.next, 100000);
    assert.strictEqual(result.progress, 50);
  });

  it("should calculate S rank", () => {
    const result = calculateRank(30000, thresholds, "Stars");
    assert.strictEqual(result.rank, "S");
    assert.strictEqual(result.next, 50000);
    assert.strictEqual(result.progress, 50);
  });

  it("should calculate A rank", () => {
    const result = calculateRank(6000, thresholds, "Stars");
    assert.strictEqual(result.rank, "A");
    assert.strictEqual(result.next, 10000);
    assert.strictEqual(result.progress, 50);
  });

  it("should calculate D rank for low values", () => {
    const result = calculateRank(40, thresholds, "Stars");
    assert.strictEqual(result.rank, "D");
    assert.strictEqual(result.next, 80);
    assert.strictEqual(Math.round(result.progress), 49);
  });

  it("should handle edge case at threshold", () => {
    const result = calculateRank(10000, thresholds, "Stars");
    assert.strictEqual(result.rank, "S");
    assert.strictEqual(result.next, 50000);
    assert.strictEqual(result.progress, 0);
  });
});
