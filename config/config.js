/**
 * Application configuration for Node.js
 */

const githubToken = process.env.GITHUB_TOKEN;

const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || "3000"),
    env: process.env.NODE_ENV || "development",
  },

  // GitHub API configuration
  github: {
    // Support for multiple tokens (for load balancing)
    tokens: githubToken
      ? githubToken
          .split(",")
          .map((token) => token.trim())
          .filter(Boolean)
      : [],

    // Rate limits
    rateLimit: {
      withToken: 5000,
      withoutToken: 60,
    },

    // API endpoints
    graphqlEndpoint: "https://api.github.com/graphql",
    restEndpoint: "https://api.github.com",
  },

  // Cache configuration
  cache: {
    enabled: process.env.CACHE_ENABLED === "true",
    ttl: parseInt(process.env.CACHE_TTL || "3600"), // 1 hour default
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    enabled: process.env.LOGGING_ENABLED !== "false",
  },
};

/**
 * Get a GitHub token (round-robin if multiple tokens available)
 */
let tokenIndex = 0;
export function getGitHubToken() {
  if (config.github.tokens.length === 0) {
    return null;
  }

  const token = config.github.tokens[tokenIndex];
  tokenIndex = (tokenIndex + 1) % config.github.tokens.length;
  return token;
}

/**
 * Check if GitHub token is configured
 */
export function hasGitHubToken() {
  return config.github.tokens.length > 0;
}

/**
 * Get rate limit info
 */
export function getRateLimitInfo() {
  return {
    hasToken: hasGitHubToken(),
    tokenCount: config.github.tokens.length,
    limit: hasGitHubToken()
      ? config.github.rateLimit.withToken
      : config.github.rateLimit.withoutToken,
    perHour: true,
  };
}

/**
 * Validate GitHub token format
 */
export function isValidTokenFormat(token) {
  if (!token || typeof token !== "string") {
    return false;
  }

  // GitHub PAT formats:
  // - Classic: ghp_xxxxx (40 chars total)
  // - Fine-grained: github_pat_xxxxx
  const classicPattern = /^ghp_[a-zA-Z0-9]{36}$/;
  const fineGrainedPattern = /^github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}$/;

  return classicPattern.test(token) || fineGrainedPattern.test(token);
}

/**
 * Validate all configured tokens
 */
export function validateTokens() {
  const invalidTokens = config.github.tokens.filter(
    (token) => !isValidTokenFormat(token)
  );

  if (invalidTokens.length > 0) {
    console.warn("⚠️  Warning: Some GitHub tokens have invalid format");
    return false;
  }

  return true;
}

export { config };
