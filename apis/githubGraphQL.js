import { GitHubAPIError } from '../utils/errorHandler.js';
import { getGitHubToken, hasGitHubToken } from '../config/config.js';

/**
 * Make GraphQL request to GitHub API
 */
async function makeGraphQLRequest(query, variables = {}) {
  const token = getGitHubToken();

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'GitHub-Trophy-Generator',
    'Accept': 'application/vnd.github.v4+json',
  };

  // Add authorization header if token is available
  if (token) {
    headers['Authorization'] = `bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // Log rate limit info
    const remaining = response.headers.get('x-ratelimit-remaining');
    const limit = response.headers.get('x-ratelimit-limit');
    if (remaining && limit) {
      console.log(`GitHub API Rate Limit: ${remaining}/${limit} remaining`);

      if (parseInt(remaining) < 10) {
        console.warn('⚠️  Warning: GitHub API rate limit running low!');
      }
    }

    const data = await response.json();

    if (response.status === 200) {
      if (data.errors) {
        const errorMsg = data.errors[0].message;
        console.error('GraphQL Error:', errorMsg);
        throw new GitHubAPIError(`GraphQL Error: ${errorMsg}`, 400);
      }
      return data.data;
    } else if (response.status === 401) {
      console.error('Invalid or expired GitHub token');
      throw new GitHubAPIError(
        'Invalid or expired GitHub token. Please check your GITHUB_TOKEN.',
        401,
      );
    } else if (response.status === 403) {
      const resetTime = response.headers.get('x-ratelimit-reset');
      const resetDate = resetTime
        ? new Date(parseInt(resetTime) * 1000).toLocaleString()
        : 'unknown';
      console.error(`Rate limit exceeded. Resets at: ${resetDate}`);
      throw new GitHubAPIError(
        `Rate limit exceeded. ${
          hasGitHubToken()
            ? 'Try using a different token or wait.'
            : 'Add a GitHub token to increase rate limit.'
        }`,
        429,
      );
    } else {
      throw new GitHubAPIError(
        `GitHub API error: ${response.status}`,
        response.status,
      );
    }
  } catch (error) {
    if (error instanceof GitHubAPIError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Network error:', errorMessage);
    throw new GitHubAPIError(`Network error: ${errorMessage}`, 503);
  }
}

/**
 * Fetch all GitHub stats using GraphQL
 */
export async function fetchAllGitHubStats(username) {
  const query = `
    query($username: String!) {
      user(login: $username) {
        login
        name
        createdAt
        followers {
          totalCount
        }
        following {
          totalCount
        }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            stargazerCount
            forkCount
            issues {
              totalCount
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
        contributionsCollection {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
        }
        issues(first: 1) {
          totalCount
        }
        pullRequests(first: 1) {
          totalCount
        }
        gists(first: 1) {
          totalCount
        }
      }
    }
  `;

  try {
    const data = await makeGraphQLRequest(query, { username });

    if (!data.user) {
      throw new GitHubAPIError('User not found', 404);
    }

    const user = data.user;
    const repos = user.repositories.nodes || [];

    // Calculate total stars
    const totalStars = repos.reduce(
      (sum, repo) => sum + (repo.stargazerCount || 0),
      0,
    );

    // Calculate total forks
    const totalForks = repos.reduce(
      (sum, repo) => sum + (repo.forkCount || 0),
      0,
    );

    return {
      username: user.login,
      name: user.name,
      created_at: user.createdAt,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      public_repos: user.repositories.totalCount,
      public_gists: user.gists.totalCount,
      total_stars: totalStars,
      total_forks: totalForks,
      total_commits: user.contributionsCollection.totalCommitContributions,
      total_issues: user.issues.totalCount,
      total_prs: user.pullRequests.totalCount,
      total_reviews:
        user.contributionsCollection.totalPullRequestReviewContributions,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`GraphQL Error for user ${username}:`, errorMessage);
    throw error;
  }
}

/**
 * Fetch user's contribution stats by year
 */
export async function fetchContributionStats(username, from, to) {
  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await makeGraphQLRequest(query, { username, from, to });

    if (!data.user) {
      throw new GitHubAPIError('User not found', 404);
    }

    return data.user.contributionsCollection;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `Error fetching contribution stats for ${username}:`,
      errorMessage,
    );
    return null;
  }
}

/**
 * Fetch repository languages
 */
export async function fetchLanguages(username) {
  const query = `
    query($username: String!) {
      user(login: $username) {
        repositories(first: 100, ownerAffiliations: OWNER) {
          nodes {
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await makeGraphQLRequest(query, { username });

    if (!data.user) {
      return {};
    }

    const languageStats = {};

    data.user.repositories.nodes.forEach((repo) => {
      repo.languages.edges.forEach(({ node, size }) => {
        if (languageStats[node.name]) {
          languageStats[node.name].size += size;
        } else {
          languageStats[node.name] = {
            name: node.name,
            color: node.color,
            size: size,
          };
        }
      });
    });

    return languageStats;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error fetching languages for ${username}:`, errorMessage);
    return {};
  }
}

export { makeGraphQLRequest };
