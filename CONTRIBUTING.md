# Contributing to Era Widgets

Thank you for your interest in contributing to Era Widgets! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project follows an inclusive and respectful code of conduct. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js >= 20 (use `.nvmrc` for the exact version)
- pnpm 9.15.9 (automatically managed via `packageManager` field)
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/groovster.git
   cd groovster
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Generate CSS and validate specs:
   ```bash
   pnpm gen
   ```

5. Run checks to ensure everything works:
   ```bash
   pnpm check
   pnpm test:a11y
   ```

## Development Workflow

### Project Structure

```
spec/              # Source of truth - JSON specs for components, eras, tokens
├── schema/        # JSON Schemas
├── components/    # Component specifications
├── eras/          # Era pack definitions
├── tokens/        # Design token specifications
└── budgets/       # Output size budgets

packages/          # Published packages (CSS, elements, tokens, MCP)
tools/             # Build and validation tools
generated/         # Auto-generated docs and llms.txt (DO NOT EDIT)
demos/             # Demo pages
```

### Key Principles

1. **Spec-first**: All changes start with specs under `spec/`. Hand-editing generated files will fail CI.
2. **Generated code**: CSS, docs, and llms.txt are generated from specs via `pnpm gen`.
3. **Zero imports**: Published CSS and JS must not import other modules (enforced by `pnpm no-imports`).
4. **Accessibility first**: All components follow APG patterns and are tested with axe-core.
5. **Size budgets**: Generated outputs have size budgets to keep them agent-friendly.

### Making Changes

#### For Component/Era/Token Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Edit specs under `spec/`:
   - `spec/components/*.json` for components
   - `spec/eras/*.json` for era packs
   - `spec/tokens/tier*/*.json` for tokens

3. Run the generator:
   ```bash
   pnpm gen
   ```

4. Commit both the spec **and** generated outputs together:
   ```bash
   git add spec/ packages/ generated/
   git commit -m "feat: add new component X"
   ```

#### For Code Changes

1. For build tools and generators: edit files under `tools/`
2. For web components: edit source under `packages/elements/src/`
3. For MCP server: edit under `packages/mcp/src/`

### Testing

Before submitting a PR, ensure all checks pass:

```bash
# Validate specs and check for drift
pnpm check

# Run accessibility tests
pnpm test:a11y

# Run MCP smoke tests
pnpm mcp:smoke

# Run eval tests
pnpm eval

# Check contrast ratios
pnpm contrast
```

### Commit Messages

Follow conventional commit format:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code restructuring
- `test:` adding tests
- `chore:` maintenance tasks

Examples:
```
feat(components): add tooltip component spec
fix(eras): correct deco brass token value
docs: update README setup instructions
```

## Pull Request Process

1. **Update documentation**: If your change affects usage, update the README or relevant docs.

2. **Ensure CI passes**: All GitHub Actions checks must pass.

3. **Keep PRs focused**: One feature or fix per PR makes review easier.

4. **Write a clear description**:
   - What does this PR do?
   - Why is this change needed?
   - How was it tested?
   - Any breaking changes?

5. **Link issues**: Reference any related issues (e.g., "Closes #123").

6. **Wait for review**: A maintainer will review your PR and may request changes.

## Adding a New Component

1. Create `spec/components/your-component.json` following the schema
2. Run `pnpm gen` to generate CSS and docs
3. Add accessibility tests in `tools/a11y/`
4. Add smoke test to `demos/smoke/index.html`
5. Test across all eras and modes
6. Update budgets if needed in `spec/budgets/`

## Adding a New Era

1. Create `spec/eras/your-era/era.spec.json`
2. Create token files under `spec/tokens/tier1/` and `tier2/`
3. Run `pnpm gen`
4. Test with smoke demos
5. Run contrast checks: `pnpm contrast`

## Development Tips

- **Fast feedback**: `pnpm gen` is fast - run it after every spec change
- **Smoke tests**: Open `demos/smoke/index.html` to visually test era switching
- **Budget failures**: If you hit budget limits, consider simplifying or adjusting budgets
- **TypeScript**: The project uses strict TypeScript - enable checking in your editor

## Questions?

- Check the [README](./README.md) for project overview
- Look at existing components in `spec/components/` for examples
- Read the schemas in `spec/schema/` for validation rules

## License

By contributing to Era Widgets, you agree that your contributions will be licensed under the MIT License.
