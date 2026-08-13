/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(message, statusCode = 500, details = null) {
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
  constructor(message, statusCode = 500) {
    super(message, statusCode);
    this.name = "GitHubAPIError";
  }
}

/**
 * Validation error
 */
export class ValidationError extends APIError {
  constructor(message, details = null) {
    super(message, 400, details);
    this.name = "ValidationError";
  }
}

/**
 * Error handler middleware for Express
 */
export function errorHandler(err, req, res) {
  const error = err;

  console.error("Error occurred:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: req.path,
  });

  // Default error
  let statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  // Handle specific error types
  if (error instanceof ValidationError) {
    statusCode = 400;
  } else if (error instanceof GitHubAPIError) {
    statusCode = error.statusCode;
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
}
