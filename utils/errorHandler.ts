import type { Context } from "oak";

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  statusCode: number;
  details: any;
  timestamp: string;

  constructor(message: string, statusCode = 500, details: any = null) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * GitHub API specific error
 */
export class GitHubAPIError extends APIError {
  constructor(message: string, statusCode = 500) {
    super(message, statusCode);
    this.name = "GitHubAPIError";
  }
}

/**
 * Validation error
 */
export class ValidationError extends APIError {
  constructor(message: string, details: any = null) {
    super(message, 400, details);
    this.name = "ValidationError";
  }
}

/**
 * Error handler middleware for Oak
 */
export async function errorHandler(ctx: Context, next: () => Promise<unknown>) {
  try {
    await next();
  } catch (err) {
    const error = err as Error & { statusCode?: number };

    console.error("Error occurred:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: ctx.request.url.pathname,
    });

    // Default error
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    // Handle specific error types
    if (error instanceof ValidationError) {
      statusCode = 400;
    } else if (error instanceof GitHubAPIError) {
      statusCode = error.statusCode;
    }

    // Send error response
    ctx.response.status = statusCode;
    ctx.response.body = {
      error: {
        message,
        status: statusCode,
        timestamp: new Date().toISOString(),
        path: ctx.request.url.pathname,
      },
    };
  }
}
