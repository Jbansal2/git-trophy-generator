import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import {
  calculatePercentage,
  clamp,
  formatErrorMessage,
  generateCacheKey,
  isValidUsername,
  sanitizeParams,
} from "../utils/helpers.ts";

Deno.test("isValidUsername - valid usernames", () => {
  assertEquals(isValidUsername("octocat"), true);
  assertEquals(isValidUsername("test-user"), true);
  assertEquals(isValidUsername("user123"), true);
  assertEquals(isValidUsername("a"), true);
  assertEquals(isValidUsername("a-b-c-d-e-f-g"), true);
});

Deno.test("isValidUsername - invalid usernames", () => {
  assertEquals(isValidUsername(""), false);
  assertEquals(isValidUsername("-invalid"), false);
  assertEquals(isValidUsername("invalid-"), false);
  assertEquals(isValidUsername("invalid--name"), false);
  assertEquals(isValidUsername("a".repeat(40)), false); // Too long (40 chars)
  assertEquals(isValidUsername("user@name"), false); // Invalid character
  assertEquals(isValidUsername("user name"), false); // Space not allowed
});

Deno.test("sanitizeParams - valid parameters", () => {
  const params = {
    username: " testuser ",
    theme: "dark",
    column: "8",
    margin_w: "20",
    margin_h: "25",
    no_bg: "true",
    no_frame: false,
    rank: "S,A",
    title: "Stars",
  };

  const result = sanitizeParams(params);
  assertEquals(result.username, "testuser");
  assertEquals(result.theme, "dark");
  assertEquals(result.column, 8);
  assertEquals(result.margin_w, 20);
  assertEquals(result.margin_h, 25);
  assertEquals(result.no_bg, true);
  assertEquals(result.no_frame, false);
  assertEquals(result.rank, "S,A");
  assertEquals(result.title, "Stars");
});

Deno.test("sanitizeParams - defaults and boundaries", () => {
  const params = { username: "test" };
  const result = sanitizeParams(params);

  assertEquals(result.theme, "flat");
  assertEquals(result.column, 6);
  assertEquals(result.margin_w, 15);
  assertEquals(result.margin_h, 15);
  assertEquals(result.no_bg, false);
  assertEquals(result.no_frame, false);
});

Deno.test("sanitizeParams - invalid theme defaults to flat", () => {
  const params = { username: "test", theme: "invalid" };
  const result = sanitizeParams(params);
  assertEquals(result.theme, "flat");
});

Deno.test("sanitizeParams - column clamped to 1-10", () => {
  assertEquals(sanitizeParams({ username: "test", column: "0" }).column, 6); // 0 is invalid, defaults to 6
  assertEquals(sanitizeParams({ username: "test", column: "15" }).column, 10);
  assertEquals(sanitizeParams({ username: "test", column: "5" }).column, 5);
});

Deno.test("formatErrorMessage - known errors", () => {
  assertEquals(
    formatErrorMessage(new Error("User not found")),
    "GitHub user not found. Please check the username.",
  );
  assertEquals(
    formatErrorMessage(new Error("Rate limit exceeded")),
    "GitHub API rate limit exceeded. Please try again later.",
  );
});

Deno.test("formatErrorMessage - unknown errors", () => {
  const result = formatErrorMessage(new Error("Random error"));
  assertEquals(result, "An unexpected error occurred. Please try again.");
});

Deno.test("calculatePercentage - normal cases", () => {
  assertEquals(calculatePercentage(50, 100), 50);
  assertEquals(calculatePercentage(25, 100), 25);
  assertEquals(calculatePercentage(100, 100), 100);
  assertEquals(calculatePercentage(0, 100), 0);
});

Deno.test("calculatePercentage - edge cases", () => {
  assertEquals(calculatePercentage(150, 100), 100); // Clamped to 100
  assertEquals(calculatePercentage(50, 0), 0); // Divide by zero
  assertEquals(calculatePercentage(50, -100), 0); // Negative max
});

Deno.test("generateCacheKey - creates unique keys", () => {
  const key1 = generateCacheKey("user1", {
    theme: "dark",
    column: 6,
    no_bg: false,
    no_frame: false,
  });
  const key2 = generateCacheKey("user2", {
    theme: "dark",
    column: 6,
    no_bg: false,
    no_frame: false,
  });
  const key3 = generateCacheKey("user1", {
    theme: "light",
    column: 6,
    no_bg: false,
    no_frame: false,
  });

  assertExists(key1);
  assertExists(key2);
  assertExists(key3);

  // Different users should have different keys
  assertEquals(key1 === key2, false);

  // Different themes should have different keys
  assertEquals(key1 === key3, false);
});

Deno.test("clamp - clamps values correctly", () => {
  assertEquals(clamp(5, 0, 10), 5);
  assertEquals(clamp(-5, 0, 10), 0);
  assertEquals(clamp(15, 0, 10), 10);
  assertEquals(clamp(50, 0, 100), 50);
});
