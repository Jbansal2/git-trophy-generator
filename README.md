# 🏆 GitHub Trophy Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deno Version](https://img.shields.io/badge/deno-v2.x-green.svg)](https://deno.land)
[![CI](https://github.com/Jbansal2/git-trophy-generator/workflows/CI/badge.svg)](https://github.com/Jbansal2/git-trophy-generator/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Decorate your GitHub profile with awesome trophies!

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

The server will run at `http://localhost:3000`.

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

## How to Add to Your GitHub Profile?

1. Open your GitHub profile README.md file
2. Copy the markdown code from the trophy generator
3. Paste it into your README.md
4. Commit and push!

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

- **Flat**: Clean and simple design
- **Dark**: For dark mode lovers
- **OneDark**: Popular code editor theme
- **Radical**: Bold and colorful
- **Gruvbox**: Retro developer theme
- **Dracula**: Dark vampire theme

## Deno Support 🦕

This project uses **Deno** runtime - modern, secure, and TypeScript-first!

### Why Deno?

✅ Built-in TypeScript support (no compilation needed)  
✅ Secure by default (explicit permissions)  
✅ Modern ES modules  
✅ Fast startup and performance  
✅ No node_modules folder

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

**Start services:**

```bash
docker-compose up -d
```

This will start the GitHub Trophy app on port 3000.

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

## Deployment Options:

You can deploy this to:

- 🐳 **Docker** (local or VPS)
- Vercel
- Heroku
- Railway
- Render
- AWS ECS/EKS
- Google Cloud Run
- Azure Container Instances

After deployment, replace the URL with your production URL.

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
