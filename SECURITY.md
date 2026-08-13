# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by:

1. **DO NOT** open a public issue
2. Email the maintainer or open a private security advisory on GitHub
3. Include detailed information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Best Practices

When using this project:

1. **API Tokens**: Store GitHub tokens in `.env` file (never commit to git)
2. **Rate Limiting**: Built-in rate limiting protects against abuse
3. **Input Validation**: All user inputs are validated and sanitized
4. **Dependencies**: Keep dependencies updated regularly
5. **Redis**: If using Redis, secure it with password and firewall rules

## Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 1 week
- **Fix Release**: Depends on severity (critical issues prioritized)

## Disclosure Policy

When we receive a security report:

1. Confirm the issue and determine affected versions
2. Prepare patches for supported versions
3. Release security updates
4. Publicly disclose the vulnerability after patch is available

Thank you for helping keep this project secure!
