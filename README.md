# 🏆 GitHub Trophy Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deno Version](https://img.shields.io/badge/deno-v2.x-green.svg)](https://deno.land)
[![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Apni GitHub profile ko awesome trophies se decorate karein!

## Features

- 🦕 **Deno Runtime** - Modern, secure JavaScript/TypeScript runtime
- ⚡ **GraphQL API** - Single request for all data (faster!)
- 🏆 **Real GitHub Stats** - Accurate data from GitHub GraphQL API
- 🎯 **Dynamic Ranking System** - SSS to D ranks with progress tracking
- 🎨 **Custom Trophy SVGs** - Beautiful rank-based trophy designs
- 🎨 **Multiple Themes** - Flat, Dark, OneDark, Radical, Gruvbox, Dracula
- 📱 **Responsive Design** - Works on all devices
- 🔧 **Customizable** - Columns, spacing, filters, frames
- 💾 **Easy Integration** - Simple markdown/HTML code
- 🎯 **Filter Options** - Filter by rank or trophy name
- 🛡️ **Error Handling** - Comprehensive error handling & validation
- 🚀 **Production Ready** - TypeScript, secure permissions

## Installation

### Deno:

No installation needed! Deno will automatically download dependencies on first
run.

```bash
# Optional: Pre-cache dependencies
deno task cache
```

### GitHub Token (Recommended)

For higher rate limits, create a GitHub Personal Access Token:

1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `read:user`, `public_repo`
4. Copy `.env.example` to `.env`
5. Add your token to `.env`:
   ```
   GITHUB_TOKEN=your_github_token_here
   ```

**Rate Limits:**

- Without token: 60 requests/hour
- With token: 5000 requests/hour

## Usage

### Start the server:

```bash
deno task start
```

Server `http://localhost:3000` par run hoga.

### Development mode:

```bash
deno task dev
```

### Manual run:

```bash
deno run --allow-net --allow-read --allow-env server.ts
```

## API Usage

### Basic Usage:

```
http://localhost:3000/trophy?username=YOUR_GITHUB_USERNAME
```

### Parameters:

- `username` (required): GitHub username
- `theme` (optional): flat, dark, onedark, radical, gruvbox, dracula (default:
  flat)
- `column` (optional): Number of columns (default: 6)
- `margin_w` (optional): Horizontal margin (default: 15)
- `margin_h` (optional): Vertical margin (default: 15)
- `no_bg` (optional): Transparent background (true/false)
- `no_frame` (optional): Hide trophy frames (true/false)
- `rank` (optional): Filter by rank - e.g., `S,A` or exclude with `-C,-B`
- `title` (optional): Filter by trophy name - e.g., `Stars,Followers` or exclude
  with `-Gists`

### Examples:

**Basic:**

```markdown
![GitHub Trophy](http://localhost:3000/trophy?username=torvalds)
```

**With Theme:**

```markdown
![GitHub Trophy](http://localhost:3000/trophy?username=torvalds&theme=onedark&column=4)
```

**Filter by Rank:**

```markdown
![GitHub Trophy](http://localhost:3000/trophy?username=torvalds&rank=S,A)
```

**Exclude Trophies:**

```markdown
![GitHub Trophy](http://localhost:3000/trophy?username=torvalds&title=-Gists,-Experience)
```

**Transparent Background:**

```markdown
![GitHub Trophy](http://localhost:3000/trophy?username=torvalds&no_bg=true&no_frame=true)
```

## GitHub Profile mein kaise add karein?

1. Apni GitHub profile README.md file open karein
2. Trophy generator se markdown code copy karein
3. README.md mein paste karein
4. Commit aur push karein!

## Trophies

### Trophy Categories:

1. **⭐ Stars** - Total stars earned across repositories
2. **💻 Commits** - Estimated commit count
3. **🔧 Issues** - Total issues created
4. **🔀 Pull Requests** - Total PRs created
5. **👥 Followers** - GitHub followers
6. **📦 Repositories** - Public repositories count
7. **🎖️ Experience** - Account age in years

### Rank System:

| Rank    | Title              | Description                       | Percentile      |
| ------- | ------------------ | --------------------------------- | --------------- |
| **SSS** | **Mythic** 🌌      | Top 0.1% - Legendary contributors | ≥ 100,000 stars |
| **SS**  | **Grandmaster** 👑 | Top 1% - Elite maintainers        | ≥ 50,000 stars  |
| **S**   | **Champion** 🏆    | Top 5% - Established leaders      | ≥ 10,000 stars  |
| **A**   | **Veteran** 🎖️     | Top 20% - Experienced developers  | ≥ 2,000 stars   |
| **B**   | **Challenger** ⚔️  | Top 45% - Rising contributors     | ≥ 400 stars     |
| **C**   | **Contender** 🌟   | Top 72% - Active participants     | ≥ 80 stars      |
| **D**   | **Rookie** 🚀      | Starting journey - Welcome!       | < 80 stars      |

_Note: Thresholds vary by trophy category_

## Themes

- **Flat**: Clean aur simple design
- **Dark**: Dark mode lovers ke liye
- **OneDark**: Popular code editor theme
- **Radical**: Bold aur colorful
- **Gruvbox**: Retro developer theme
- **Dracula**: Dark vampire theme

## Deno Support 🦕

This project uses **Deno** runtime - modern, secure, and TypeScript-first!

### Why Deno?

✅ Built-in TypeScript support (no compilation needed) ✅ Secure by default
(explicit permissions) ✅ Modern ES modules ✅ Fast startup and performance ✅
No node_modules folder

## Redis Caching 🔴

Redis caching dramatically improves performance:

**Performance Comparison:**

- First request: ~500-800ms (fetches from GitHub API)
- Cached request: ~10-50ms (Redis cache hit)
- Cache TTL: 1 hour (configurable)

**Cache Features:**

- Automatic fallback to in-memory cache if Redis unavailable
- Smart cache key generation (username + theme + filters)
- Cache hit/miss tracking in response headers
- Easy cache management via `/health` endpoint

**Environment Variables:**

```bash
CACHE_ENABLED=true              # Enable caching
CACHE_TTL=3600                  # Cache duration in seconds
REDIS_URL=redis://localhost:6379  # Redis connection URL
```

## Docker Deployment 🐳

### Using Docker:

**Build image:**

```bash
docker build -t github-trophy .
```

**Run container:**

```bash
docker run -p 3000:3000 --env-file .env github-trophy
```

**Or with inline token:**

```bash
docker run -p 3000:3000 -e GITHUB_TOKEN=your_token_here github-trophy
```

### Using Docker Compose:

**Start all services (app + Redis):**

```bash
docker-compose up -d
```

This will start:

- GitHub Trophy app on port 3000
- Redis cache on port 6379

**View logs:**

```bash
docker-compose logs -f
```

**Stop services:**

```bash
docker-compose down
```

**Rebuild:**

```bash
docker-compose up -d --build
```

### Environment Variables:

Create `.env` file with your GitHub token:

```
GITHUB_TOKEN=ghp_your_token_here
```

Or add multiple tokens (comma-separated):

```
GITHUB_TOKEN=token1,token2,token3
```

## Deploy karne ke liye:

Aap ise deploy kar sakte hain:

- 🐳 **Docker** (local ya VPS)
- Vercel
- Heroku
- Railway
- Render
- AWS ECS/EKS
- Google Cloud Run
- Azure Container Instances

Deploy karne ke baad, URL ko replace kar dein apne production URL se.

## Testing

Run all tests:

```bash
deno task test
```

Run tests in watch mode:

```bash
deno task test:watch
```

Format code:

```bash
deno task fmt
```

Lint code:

```bash
deno task lint
```

## Contributing

Contributions are welcome! Please read our
[Contributing Guidelines](CONTRIBUTING.md) and
[Code of Conduct](CODE_OF_CONDUCT.md) before submitting PRs.

### Development Setup

1. Fork and clone the repository
2. Create a `.env` file from `.env.example`
3. Add your GitHub token (optional but recommended)
4. Run the development server:
   ```bash
   deno task dev
   ```
5. Make your changes and add tests
6. Run tests: `deno task test`
7. Format code: `deno task fmt`
8. Submit a PR!

### Project Structure

```
github-trophy/
├── apis/               # API modules
│   ├── githubGraphQL.ts    # GitHub GraphQL API client
│   ├── svgGenerator.ts     # SVG trophy generator
│   └── trophy.ts           # Trophy logic & ranking
├── utils/              # Utility functions
│   ├── cache.ts            # Caching utilities (currently disabled)
│   ├── errorHandler.ts     # Error handling
│   └── helpers.ts          # Helper functions
├── config/             # Configuration
│   └── config.ts           # App configuration
├── tests/              # Test files
│   ├── helpers_test.ts     # Helper function tests
│   ├── trophy_test.ts      # Trophy logic tests
│   └── svgGenerator_test.ts # SVG generation tests
├── ass/                # Custom trophy SVG assets
├── .github/            # GitHub templates & workflows
│   ├── ISSUE_TEMPLATE/     # Issue templates
│   └── workflows/          # CI/CD workflows
├── server.ts           # Main server file
├── deno.json          # Deno configuration & tasks
└── docker-compose.yml # Docker setup
```

## Security

For security issues, please review our [Security Policy](SECURITY.md).

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Deno](https://deno.land) 🦕
- Powered by [GitHub GraphQL API](https://docs.github.com/en/graphql)
- Inspired by the amazing GitHub developer community

---

Made with ❤️ for GitHub developers

**Star ⭐ this repo if you found it useful!**
