# Contributing to GitHub Trophy Generator

Thank you for considering contributing to GitHub Trophy Generator! 🎉

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug
report, include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an
enhancement suggestion, include:

- Clear description of the enhancement
- Use case and motivation
- Possible implementation approach
- Any alternatives you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes**:
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed
4. **Test your changes**:
   ```bash
   npm test
   ```
5. **Commit your changes**:
   - Use clear, descriptive commit messages
   - Follow conventional commits format: `feat:`, `fix:`, `docs:`, etc.
6. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- Git
- (Optional) Redis for caching

### Local Development

1. Clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/github-trophy.git
   cd github-trophy
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Add your GitHub token to `.env`:

   ```
   GITHUB_TOKEN=your_token_here
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Server runs at `http://localhost:3000`

### Running Tests

```bash
# Run all tests
npm test

# Run tests with watch mode
npm test -- --watch

# Run specific test file
node --test tests/trophy.test.js
```

## Project Structure

```
github-trophy/
├── apis/           # API logic (GitHub GraphQL, trophy generation, SVG)
├── config/         # Configuration (tokens, env vars)
├── utils/          # Utility functions (cache, error handling, helpers)
├── tests/          # Test files
├── ass/            # Custom trophy SVG assets
├── public/         # Static files (HTML frontend)
├── server.js       # Main server file
└── package.json    # Node.js configuration
```

## Code Style Guidelines

### JavaScript/Node.js

- Use ES6+ modern JavaScript syntax
- Use explicit JSDoc types where helpful
- Follow Node.js best practices
- Use descriptive variable names
- Add JSDoc comments for exported functions

### Example:

```typescript
/**
 * Generates trophy SVG based on GitHub stats
 * @param trophies - Array of trophy data
 * @param options - Customization options (theme, columns, etc.)
 * @returns Promise resolving to SVG string
 */
export async function generateTrophySVG(
  trophies: Trophy[],
  options: TrophyOptions
): Promise<string> {
  // Implementation
}
```

## Adding New Features

### Adding a New Trophy Rank

1. Add SVG file to `ass/` folder
2. Update `rankToSvgFile` mapping in `apis/svgGenerator.ts`
3. Update rank thresholds in `apis/trophy.ts`
4. Add tests for new rank
5. Update README documentation

### Adding a New Theme

1. Add theme colors to `themeStyles` in `apis/svgGenerator.ts`
2. Test with various trophy combinations
3. Update README with theme preview
4. Add theme to documentation

### Adding Tests

Tests are located in `tests/` folder. Use Node.js built-in test framework:

```javascript
import { describe, it } from "node:test";
import assert from "node:assert";
import { myFunction } from "../path/to/module.js";

describe("My Function", () => {
  it("should work correctly", () => {
    const result = myFunction();
    assert.strictEqual(result, expectedValue);
  });
});
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update API documentation for new parameters
- Include examples where helpful

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add new trophy rank SSS`
- `fix: correct progress bar width calculation`
- `docs: update installation instructions`
- `test: add tests for SVG generation`
- `refactor: simplify cache logic`
- `style: format code with npm run format`
- `chore: update dependencies`

## Questions?

Feel free to:

- Open an issue for discussion
- Ask in pull request comments
- Check existing issues and pull requests

Thank you for contributing! 🙏
