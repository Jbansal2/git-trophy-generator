import { describe, it } from "node:test";
import assert from "node:assert";
import {
  calculatePercentage,
  clamp,
  formatErrorMessage,
  isValidUsername,
  sanitizeParams,
} from "../utils/helpers.js";

describe("Helpers - isValidUsername", () => {
  it("should validate correct usernames", () => {
    assert.strictEqual(isValidUsername("octocat"), true);
    assert.strictEqual(isValidUsername("test-user"), true);
    assert.strictEqual(isValidUsername("user123"), true);
    assert.strictEqual(isValidUsername("a"), true);
  });

  it("should reject invalid usernames", () => {
    assert.strictEqual(isValidUsername(""), false);
    assert.strictEqual(isValidUsername("-invalid"), false);
    assert.strictEqual(isValidUsername("invalid-"), false);
    assert.strictEqual(isValidUsername("a".repeat(40)), false);
  });
});

describe("Helpers - sanitizeParams", () => {
  it("should sanitize and validate parameters", () => {
    const params = {
      username: " testuser ",
      theme: "dark",
      column: "8",
      no_bg: "true",
    };

    const result = sanitizeParams(params);
    assert.strictEqual(result.username, "testuser");
    assert.strictEqual(result.theme, "dark");
    assert.strictEqual(result.column, 8);
    assert.strictEqual(result.no_bg, true);
  });

  it("should apply defaults", () => {
    const params = { username: "test" };
    const result = sanitizeParams(params);

    assert.strictEqual(result.theme, "flat");
    assert.strictEqual(result.column, 6);
    assert.strictEqual(result.margin_w, 15);
  });

  it("should clamp column between 1-10", () => {
    assert.strictEqual(
      sanitizeParams({ username: "test", column: "0" }).column,
      6
    );
    assert.strictEqual(
      sanitizeParams({ username: "test", column: "15" }).column,
      10
    );
  });
});

describe("Helpers - formatErrorMessage", () => {
  it("should format known errors", () => {
    const error = new Error("User not found");
    const message = formatErrorMessage(error);
    assert.strictEqual(
      message,
      "GitHub user not found. Please check the username."
    );
  });

  it("should format unknown errors", () => {
    const error = new Error("Random error");
    const message = formatErrorMessage(error);
    assert.strictEqual(
      message,
      "An unexpected error occurred. Please try again."
    );
  });
});

describe("Helpers - calculatePercentage", () => {
  it("should calculate percentage correctly", () => {
    assert.strictEqual(calculatePercentage(50, 100), 50);
    assert.strictEqual(calculatePercentage(25, 100), 25);
    assert.strictEqual(calculatePercentage(100, 100), 100);
  });

  it("should handle edge cases", () => {
    assert.strictEqual(calculatePercentage(150, 100), 100);
    assert.strictEqual(calculatePercentage(50, 0), 0);
  });
});

describe("Helpers - clamp", () => {
  it("should clamp values correctly", () => {
    assert.strictEqual(clamp(5, 0, 10), 5);
    assert.strictEqual(clamp(-5, 0, 10), 0);
    assert.strictEqual(clamp(15, 0, 10), 10);
  });
});
