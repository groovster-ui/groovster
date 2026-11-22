# Release checklist

Do not publish from this checklist. Nothing here uploads a package or a marketplace listing.

- [ ] `pnpm gen`
- [ ] `pnpm check`
- [ ] `pnpm lint`
- [ ] `pnpm test:unit`
- [ ] `pnpm test:react`
- [ ] `pnpm test:elements`
- [ ] `pnpm test:a11y`
- [ ] `pnpm test:sites`
- [ ] `pnpm test:packages`
- [ ] `pnpm mcp:smoke`
- [ ] `pnpm eval`
- [ ] `pnpm eval:sites`
- [ ] `pnpm fidelity:density`
- [ ] `pnpm skill:verify`
- [ ] `pnpm sizes:check`
- [ ] `pnpm registry:e2e`
- [ ] `@groovster/css`, `@groovster/elements`, and `@groovster/tokens` still have no runtime dependencies
- [ ] Reference sites label fictional payments and do not call a payment, auth, or analytics service
- [ ] Live-model evaluation stays unrun unless a person authorizes the cost
- [ ] Generated files are committed with the spec that produced them
