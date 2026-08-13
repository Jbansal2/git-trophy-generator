/**
 * Validate GitHub username
 */
export function isValidUsername(username) {
  if (!username || typeof username !== 'string') {
    return false;
  }

  // GitHub username rules: 1-39 characters, alphanumeric and hyphens only
  const regex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
  return regex.test(username);
}

/**
 * Sanitize query parameters
 */
export function sanitizeParams(params) {
  const {
    username,
    theme = 'flat',
    column = 6,
    margin_w = 15,
    margin_h = 15,
    no_bg = false,
    no_frame = false,
    rank,
    title,
  } = params;

  return {
    username: username?.trim(),
    theme:
      ['flat', 'dark', 'radical', 'gruvbox', 'onedark', 'dracula'].includes(
          theme,
        )
        ? theme
        : 'flat',
    column: Math.min(Math.max(parseInt(column) || 6, 1), 10),
    margin_w: Math.max(parseInt(margin_w) || 15, 0),
    margin_h: Math.max(parseInt(margin_h) || 15, 0),
    no_bg: no_bg === 'true' || no_bg === true,
    no_frame: no_frame === 'true' || no_frame === true,
    rank: rank?.trim(),
    title: title?.trim(),
  };
}

/**
 * Format error message for client
 */
export function formatErrorMessage(error) {
  const errorMessages = {
    'User not found': 'GitHub user not found. Please check the username.',
    'Rate limit exceeded':
      'GitHub API rate limit exceeded. Please try again later.',
    'Network error':
      'Unable to connect to GitHub API. Please check your connection.',
    'Invalid response': 'Received invalid response from GitHub API.',
  };

  return errorMessages[error.message] ||
    'An unexpected error occurred. Please try again.';
}

/**
 * Calculate percentage for progress bar
 */
export function calculatePercentage(current, max) {
  if (!max || max <= 0) return 0;
  return Math.min(Math.round((current / max) * 100), 100);
}

/**
 * Generate cache key
 */
export function generateCacheKey(username, params) {
  const { theme, column, no_bg, no_frame, rank, title } = params;
  return `trophy_${username}_${theme}_${column}_${no_bg}_${no_frame}_${
    rank || 'all'
  }_${title || 'all'}`;
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
