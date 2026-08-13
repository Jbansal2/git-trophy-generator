// Load environment variables
import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import { generateTrophiesFromStats } from './apis/trophy.js';
import { generateTrophySVG } from './apis/svgGenerator.js';
import { isValidUsername, sanitizeParams } from './utils/helpers.js';
import { errorHandler, ValidationError } from './utils/errorHandler.js';
import {
  config,
  getRateLimitInfo,
  hasGitHubToken,
  validateTokens,
} from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Validate tokens on startup
if (hasGitHubToken()) {
  console.log('✅ GitHub token(s) detected');
  if (validateTokens()) {
    console.log(`✅ ${config.github.tokens.length} valid token(s) configured`);
  } else {
    console.warn('⚠️  Some tokens may be invalid');
  }
} else {
  console.warn('⚠️  No GitHub token configured - Rate limit: 60 requests/hour');
  console.log('💡 Add GITHUB_TOKEN to .env for 5000 requests/hour');
}

// Static files
app.use(express.static(join(__dirname, 'public')));

// Root route - serve index.html
app.get('/', async (req, res) => {
  try {
    const html = await readFile(join(__dirname, 'public', 'index.html'), 'utf-8');
    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(404).send('Not found');
  }
});

// Trophy SVG generator
app.get('/trophy', async (req, res) => {
  try {
    const params = sanitizeParams(req.query);
    const { username } = params;

    if (!username) {
      throw new ValidationError('Username is required');
    }

    if (!isValidUsername(username)) {
      throw new ValidationError('Invalid GitHub username format');
    }

    // Fetch all stats using GraphQL
    const trophies = await generateTrophiesFromStats(username);

    // Generate SVG
    const svgContent = await generateTrophySVG(trophies, params);

    res.set('Content-Type', 'image/svg+xml');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('X-Cache', 'DISABLED');
    res.set('X-Content-Type-Options', 'nosniff');
    res.send(svgContent);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error generating trophy:`, errorMessage);
    res.status(error.statusCode || 500).json({
      error: errorMessage,
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  const rateLimitInfo = getRateLimitInfo();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    runtime: 'Node.js',
    version: process.version,
    api: 'GraphQL',
    cache: 'DISABLED',
    rateLimit: {
      configured: rateLimitInfo.hasToken,
      tokensCount: rateLimitInfo.tokenCount,
      limit: `${rateLimitInfo.limit} requests/hour`,
      recommendation: rateLimitInfo.hasToken
        ? 'Token configured ✅'
        : 'Add GitHub token for higher limits',
    },
  });
});

// Rate limit info endpoint
app.get('/api/rate-limit', (req, res) => {
  const rateLimitInfo = getRateLimitInfo();

  res.json({
    hasToken: rateLimitInfo.hasToken,
    tokensConfigured: rateLimitInfo.tokenCount,
    requestsPerHour: rateLimitInfo.limit,
    type: rateLimitInfo.hasToken ? 'authenticated' : 'unauthenticated',
    recommendation: rateLimitInfo.hasToken
      ? null
      : 'Configure GITHUB_TOKEN environment variable for higher rate limits',
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

const PORT = config.server.port;

console.log(`\n${'='.repeat(60)}`);
console.log(`🏆 GitHub Trophy Generator`);
console.log(`${'='.repeat(60)}`);
console.log(`⚡ Runtime: Node.js ${process.version}`);
console.log(`🚀 Server running: http://localhost:${PORT}`);
console.log(`📊 Health check: http://localhost:${PORT}/health`);
console.log(`📈 Rate limit info: http://localhost:${PORT}/api/rate-limit`);
console.log(`⚡ API: GitHub GraphQL`);
console.log(
  `🔑 Auth: ${
    hasGitHubToken()
      ? `✅ ${config.github.tokens.length} token(s)`
      : '❌ No token'
  }`,
);
console.log(`📊 Rate Limit: ${getRateLimitInfo().limit} requests/hour`);
console.log(`${'='.repeat(60)}\n`);

app.listen(PORT, () => {
  console.log(`✅ Server started successfully`);
});
