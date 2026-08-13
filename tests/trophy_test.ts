import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { calculateRank, getRankTitle } from "../apis/trophy.ts";

Deno.test("getRankTitle - Stars category", () => {
  assertEquals(getRankTitle("SSS", "Stars"), "Legendary Project");
  assertEquals(getRankTitle("SS", "Stars"), "Superstar");
  assertEquals(getRankTitle("S", "Stars"), "Acclaimed");
  assertEquals(getRankTitle("A", "Stars"), "Popular");
  assertEquals(getRankTitle("B", "Stars"), "Rising Star");
  assertEquals(getRankTitle("C", "Stars"), "Emerging");
  assertEquals(getRankTitle("D", "Stars"), "Rookie");
});

Deno.test("getRankTitle - Commits category", () => {
  assertEquals(getRankTitle("SSS", "Commits"), "Relentless Coder");
  assertEquals(getRankTitle("SS", "Commits"), "Commit Machine");
  assertEquals(getRankTitle("S", "Commits"), "Committer");
});

Deno.test("getRankTitle - unknown category defaults to Rookie", () => {
  assertEquals(getRankTitle("S", "UnknownCategory"), "Rookie");
});

Deno.test("calculateRank - SSS rank (max level)", () => {
  const thresholds = {
    SSS: 100000,
    SS: 50000,
    S: 10000,
    A: 2000,
    B: 400,
    C: 80,
    D: 1,
  };

  const result = calculateRank(150000, thresholds, "Stars");
  assertEquals(result.rank, "SSS");
  assertEquals(result.next, null);
  assertEquals(result.progress, 100);
  assertExists(result.title);
});

Deno.test("calculateRank - SS rank", () => {
  const thresholds = {
    SSS: 100000,
    SS: 50000,
    S: 10000,
    A: 2000,
    B: 400,
    C: 80,
    D: 1,
  };

  const result = calculateRank(75000, thresholds, "Stars");
  assertEquals(result.rank, "SS");
  assertEquals(result.next, 100000);
  assertEquals(result.progress, 50); // 75k is 50% between 50k and 100k
});

Deno.test("calculateRank - S rank", () => {
  const thresholds = {
    SSS: 100000,
    SS: 50000,
    S: 10000,
    A: 2000,
    B: 400,
    C: 80,
    D: 1,
  };

  const result = calculateRank(30000, thresholds, "Stars");
  assertEquals(result.rank, "S");
  assertEquals(result.next, 50000);
  assertEquals(result.progress, 50); // 30k is 50% between 10k and 50k
});

Deno.test("calculateRank - A rank", () => {
  const thresholds = {
    SSS: 100000,
    SS: 50000,
    S: 10000,
    A: 2000,
    B: 400,
    C: 80,
    D: 1,
  };

  const result = calculateRank(6000, thresholds, "Stars");
  assertEquals(result.rank, "A");
  assertEquals(result.next, 10000);
  assertEquals(result.progress, 50); // 6k is 50% between 2k and 10k
});

Deno.test("calculateRank - B rank", () => {
  const thresholds = {
    SSS: 100000,
    SS: 50000,
    S: 10000,
    A: 2000,
    B: 400,
    C: 80,
    D: 1,
  };

  const result = calculateRank(1200, thresholds, "Stars");
  assertEquals(result.rank, "B");
  assertEquals(result.next, 2000);
  assertEquals(result.progress, 50); // 1200 is 50% between 400 and 2000
});

Deno.test("calculateRank - C rank", () => {
  const thresholds = {
    SSS: 100000,
    SS: 50000,
    S: 10000,
    A: 2000,
    B: 400,
    C: 80,
    D: 1,
  };

  const result = calculateRank(240, thresholds, "Stars");
  assertEquals(result.rank, "C");
  assertEquals(result.next, 400);
  assertEquals(result.progress, 50); // 240 is 50% between 80 and 400
});

Deno.test("calculateRank - D rank (low value)", () => {
  const thresholds = {
    SSS: 100000,
    SS: 50000,
    S: 10000,
    A: 2000,
    B: 400,
    C: 80,
    D: 1,
  };

  const result = calculateRank(40, thresholds, "Stars");
  assertEquals(result.rank, "D");
  assertEquals(result.next, 80);
  // Progress: (40 - 1) / (80 - 1) * 100 = 39/79 * 100 = ~49.37
  assertEquals(Math.round(result.progress), 49);
});

Deno.test("calculateRank - very low value", () => {
  const thresholds = {
    SSS: 100000,
    SS: 50000,
    S: 10000,
    A: 2000,
    B: 400,
    C: 80,
    D: 1,
  };

  const result = calculateRank(0, thresholds, "Stars");
  assertEquals(result.rank, "D");
  assertEquals(result.next, 1);
});

Deno.test("calculateRank - edge case at threshold", () => {
  const thresholds = {
    SSS: 100000,
    SS: 50000,
    S: 10000,
    A: 2000,
    B: 400,
    C: 80,
    D: 1,
  };

  const result = calculateRank(10000, thresholds, "Stars");
  assertEquals(result.rank, "S"); // Exactly at threshold
  assertEquals(result.next, 50000);
  assertEquals(result.progress, 0);
});
