# Security Policy

## Supported Versions

This project is currently in alpha (version 0.x). Security updates will be provided for the latest alpha release.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Era Widgets, please report it privately to help us fix it before public disclosure.

### How to Report

1. **DO NOT** create a public GitHub issue for the vulnerability
2. Email the maintainers with details about the vulnerability
3. Include steps to reproduce, potential impact, and any suggested fixes
4. Allow reasonable time for the maintainers to address the issue before public disclosure

### What to Expect

- **Acknowledgment**: You should receive an acknowledgment of your report within 48 hours
- **Updates**: We will keep you informed about our progress in addressing the vulnerability
- **Credit**: If you wish, we will acknowledge your contribution in the security advisory and release notes
- **Timeline**: We aim to address critical vulnerabilities within 7 days and other vulnerabilities within 30 days

### Security Best Practices for Users

When using Era Widgets in your projects:

1. **Keep dependencies updated**: Regularly update to the latest version using `pnpm update`
2. **Review generated code**: While our CSS and JS are generated, review the output before deploying
3. **CSP considerations**: Ensure your Content Security Policy allows the styles needed for Era Widgets
4. **Sanitize user input**: If you're generating Era Widget markup from user input, ensure proper sanitization

## Security Features

- **No external dependencies in published packages**: Our CSS and JS packages have zero runtime dependencies
- **Automated dependency updates**: We use Dependabot to keep dependencies up to date
- **Locked dependencies**: We use `pnpm-lock.yaml` to ensure reproducible builds

## Disclosure Policy

We follow responsible disclosure practices. Once a vulnerability is fixed:

1. We will publish a security advisory on GitHub
2. Release notes will include details about the fix
3. If applicable, a CVE will be requested
