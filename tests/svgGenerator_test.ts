import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { generateTrophySVG } from "../apis/svgGenerator.ts";

const mockTrophies = [
  {
    name: "Stars",
    rank: "S",
    title: "Acclaimed",
    value: 15000,
    progress: 50,
    next: 50000,
    color: "#FFD700",
    icon: "⭐",
  },
  {
    name: "Commits",
    rank: "A",
    title: "Dedicated",
    value: 3000,
    progress: 60,
    next: 5000,
    color: "#C0C0C0",
    icon: "💻",
  },
  {
    name: "Followers",
    rank: "B",
    title: "Rising Voice",
    value: 75,
    progress: 25,
    next: 200,
    color: "#CD7F32",
    icon: "👥",
  },
];

Deno.test("generateTrophySVG - generates valid SVG", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
  });

  // Check if it's valid SVG
  assertStringIncludes(svg, "<svg");
  assertStringIncludes(svg, "</svg>");
  assertStringIncludes(svg, 'xmlns="http://www.w3.org/2000/svg"');
});

Deno.test("generateTrophySVG - includes trophy names", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
  });

  assertStringIncludes(svg, "STARS");
  assertStringIncludes(svg, "COMMITS");
  assertStringIncludes(svg, "FOLLOWERS");
});

Deno.test("generateTrophySVG - includes rank titles", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
  });

  assertStringIncludes(svg, "Acclaimed");
  assertStringIncludes(svg, "Dedicated");
  assertStringIncludes(svg, "Rising Voice");
});

Deno.test("generateTrophySVG - respects column count", async () => {
  const svg2Cols = await generateTrophySVG(mockTrophies.slice(0, 2), {
    theme: "flat",
    column: 2,
  });
  const svg1Col = await generateTrophySVG(mockTrophies.slice(0, 1), {
    theme: "flat",
    column: 1,
  });

  // Width calculation: (trophyWidth + marginW) * cols - marginW
  // For 2 cols: (152 + 5) * 2 - 5 = 309
  assertStringIncludes(svg2Cols, 'width="309"');

  // For 1 col: (152 + 5) * 1 - 5 = 152
  assertStringIncludes(svg1Col, 'width="152"');
});

Deno.test("generateTrophySVG - filters by rank (include)", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
    rank: "S,A",
  });

  // Should include S and A ranks
  assertStringIncludes(svg, "STARS"); // S rank
  assertStringIncludes(svg, "COMMITS"); // A rank

  // Should NOT include B rank (followers)
  // Check by counting trophy cards
  const cardCount = (svg.match(/class="trophy-card"/g) || []).length;
  assertEquals(cardCount, 2); // Only 2 trophies (S and A)
});

Deno.test("generateTrophySVG - filters by rank (exclude)", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
    rank: "-B",
  });

  // Should include all except B
  const cardCount = (svg.match(/class="trophy-card"/g) || []).length;
  assertEquals(cardCount, 2); // 3 - 1 = 2 trophies
});

Deno.test("generateTrophySVG - filters by title (include)", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
    title: "Stars,Commits",
  });

  assertStringIncludes(svg, "STARS");
  assertStringIncludes(svg, "COMMITS");

  const cardCount = (svg.match(/class="trophy-card"/g) || []).length;
  assertEquals(cardCount, 2);
});

Deno.test("generateTrophySVG - filters by title (exclude)", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
    title: "-Followers",
  });

  const cardCount = (svg.match(/class="trophy-card"/g) || []).length;
  assertEquals(cardCount, 2); // All except Followers
});

Deno.test("generateTrophySVG - applies dark theme", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "dark",
    column: 3,
  });

  assertStringIncludes(svg, "#0d1117"); // Dark theme background
  assertStringIncludes(svg, "#c9d1d9"); // Dark theme text
});

Deno.test("generateTrophySVG - applies radical theme", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "radical",
    column: 3,
  });

  assertStringIncludes(svg, "#141321"); // Radical theme background
  assertStringIncludes(svg, "drop-shadow"); // Radical has shadow
});

Deno.test("generateTrophySVG - transparent background", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
    no_bg: "true",
  });

  assertStringIncludes(svg, 'fill="transparent"');
});

Deno.test("generateTrophySVG - includes progress bars", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
  });

  // Progress bars should be present
  assertStringIncludes(svg, "50 pt"); // Stars progress
  assertStringIncludes(svg, "60 pt"); // Commits progress
  assertStringIncludes(svg, "25 pt"); // Followers progress
});

Deno.test("generateTrophySVG - includes rank badges", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
  });

  // Rank letters should be in the SVG
  assertStringIncludes(svg, ">S<"); // S rank
  assertStringIncludes(svg, ">A<"); // A rank
  assertStringIncludes(svg, ">B<"); // B rank
});

Deno.test("generateTrophySVG - includes postage stamp borders", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
  });

  // Check for scalloped edge circles
  assertStringIncludes(svg, '<circle cx="10" cy="0" r="4"/>'); // Top edge
  assertStringIncludes(svg, '<circle cx="0" cy="20" r="4"/>'); // Left edge
});

Deno.test("generateTrophySVG - no frame option", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
    no_frame: "true",
  });

  // Should not have stamp circles when no_frame is true
  const circleCount = (svg.match(/<circle/g) || []).length;
  // Only rank badge circles should be present (3 trophies = 3 circles)
  assertEquals(circleCount, 3);
});

Deno.test("generateTrophySVG - custom margins", async () => {
  const svg = await generateTrophySVG(mockTrophies.slice(0, 2), {
    theme: "flat",
    column: 2,
    margin_w: 10,
    margin_h: 20,
  });

  // Width with margin_w=10: (152 + 10) * 2 - 10 = 314
  assertStringIncludes(svg, 'width="314"');
});

Deno.test("generateTrophySVG - handles empty trophy array", async () => {
  const svg = await generateTrophySVG([], { theme: "flat", column: 3 });

  // Should still generate valid SVG structure
  assertStringIncludes(svg, "<svg");
  assertStringIncludes(svg, "</svg>");
});

Deno.test("generateTrophySVG - includes xlink namespace", async () => {
  const svg = await generateTrophySVG(mockTrophies, {
    theme: "flat",
    column: 3,
  });

  // Must have xlink namespace for SVG images
  assertStringIncludes(svg, 'xmlns:xlink="http://www.w3.org/1999/xlink"');
});
