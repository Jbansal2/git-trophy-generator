// Load environment variables FIRST before anything else
import "https://deno.land/std@0.208.0/dotenv/load.ts";

// Now import other modules
import { Application, Router } from "oak";
import { generateTrophiesFromStats } from "./apis/trophy.ts";
import { generateTrophySVG } from "./apis/svgGenerator.ts";
import { isValidUsername, sanitizeParams } from "./utils/helpers.ts";
import { errorHandler, ValidationError } from "./utils/errorHandler.ts";
import {
  config,
  getRateLimitInfo,
  hasGitHubToken,
  validateTokens,
} from "./config/config.ts";

const app = new Application();
const router = new Router();

// Validate tokens on startup
if (hasGitHubToken()) {
  console.log("✅ GitHub token(s) detected");
  if (validateTokens()) {
    console.log(`✅ ${config.github.tokens.length} valid token(s) configured`);
  } else {
    console.warn("⚠️  Some tokens may be invalid");
  }
} else {
  console.warn("⚠️  No GitHub token configured - Rate limit: 60 requests/hour");
  console.log("💡 Add GITHUB_TOKEN to .env for 5000 requests/hour");
}

// Static file serving
router.get("/", async (ctx) => {
  try {
    const html = await Deno.readTextFile("./public/index.html");
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = html;
  } catch (_error) {
    ctx.response.status = 404;
    ctx.response.body = "Not found";
  }
});

// Trophy SVG generator using GraphQL
router.get("/trophy", async (ctx) => {
  try {
    const params = sanitizeParams(
      Object.fromEntries(ctx.request.url.searchParams),
    );
    const { username } = params;

    if (!username) {
      throw new ValidationError("Username is required");
    }

    if (!isValidUsername(username as string)) {
      throw new ValidationError("Invalid GitHub username format");
    }

    // CACHING COMPLETELY DISABLED - Always fetch fresh data

    // Fetch all stats using GraphQL (single request!)
    const trophies = await generateTrophiesFromStats(username as string);

    // Generate SVG (now async to load trophy files)
    const svgContent = await generateTrophySVG(trophies, params);

    ctx.response.headers.set("Content-Type", "image/svg+xml");
    ctx.response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate",
    );
    ctx.response.headers.set("Pragma", "no-cache");
    ctx.response.headers.set("Expires", "0");
    ctx.response.headers.set("X-Cache", "DISABLED");
    ctx.response.headers.set("X-Content-Type-Options", "nosniff");
    ctx.response.body = svgContent;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error generating trophy:`, errorMessage);
    throw error;
  }
});

// Health check endpoint with rate limit info
router.get("/health", (ctx) => {
  const rateLimitInfo = getRateLimitInfo();

  ctx.response.body = {
    status: "ok",
    timestamp: new Date().toISOString(),
    runtime: "Deno",
    version: Deno.version.deno,
    api: "GraphQL",
    cache: "DISABLED",
    rateLimit: {
      configured: rateLimitInfo.hasToken,
      tokensCount: rateLimitInfo.tokenCount,
      limit: `${rateLimitInfo.limit} requests/hour`,
      recommendation: rateLimitInfo.hasToken
        ? "Token configured ✅"
        : "Add GitHub token for higher limits",
    },
  };
});

// Rate limit info endpoint
router.get("/api/rate-limit", (ctx) => {
  const rateLimitInfo = getRateLimitInfo();

  ctx.response.body = {
    hasToken: rateLimitInfo.hasToken,
    tokensConfigured: rateLimitInfo.tokenCount,
    requestsPerHour: rateLimitInfo.limit,
    type: rateLimitInfo.hasToken ? "authenticated" : "unauthenticated",
    recommendation: rateLimitInfo.hasToken
      ? null
      : "Configure GITHUB_TOKEN environment variable for higher rate limits",
  };
});

// Error handling middleware
app.use(errorHandler);

// Routes
app.use(router.routes());
app.use(router.allowedMethods());

// 404 handler
app.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.body = { error: "Not Found", path: ctx.request.url.pathname };
});

const PORT = config.server.port;

console.log(`\n${"=".repeat(60)}`);
console.log(`🏆 GitHub Trophy Generator (Deno)`);
console.log(`${"=".repeat(60)}`);
console.log(`🦕 Runtime: Deno ${Deno.version.deno}`);
console.log(`🚀 Server running: http://localhost:${PORT}`);
console.log(`📊 Health check: http://localhost:${PORT}/health`);
console.log(`📈 Rate limit info: http://localhost:${PORT}/api/rate-limit`);
console.log(`⚡ API: GitHub GraphQL`);
console.log(
  `🔑 Auth: ${
    hasGitHubToken()
      ? `✅ ${config.github.tokens.length} token(s)`
      : "❌ No token"
  }`,
);
console.log(`📊 Rate Limit: ${getRateLimitInfo().limit} requests/hour`);
console.log(`${"=".repeat(60)}\n`);

await app.listen({ port: PORT });
