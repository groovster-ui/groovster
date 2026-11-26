# Groovy review and validation

Based on latest `main` at `7cdb0bb6f91065d4742312044b8d0afeab850bae`, rechecked before delivery. The referenced conversation was read. Its generated image attachment was unavailable; acceptance was interpreted from the user's detailed description of the approved second image and the retrieved prior critique. This is an original implementation of that visual language, not a traced reproduction or a claim of pixel equivalence.

## Visual and UX passes

1. **Typography and structure:** replaced generic pill/sticker styling with compact Spicy Rice display lettering, sculpted controls, cream panels and period palette. The first actual Chromium render revealed overly repetitive panels and too much identity concentrated in the hero.
2. **Composition:** varied panel silhouettes and header inks, added continuous panel contours and data frames, reduced hero height, and replaced tight ribbon bends that produced pointed inner offsets with broad continuous curves. The page retains its identity below the hero. Standard preserves typography and shape; Whisper uses fine ink and quieter controls.
3. **Usability:** tested dense home and all 21 components at 320, 390, 768, 1024, 1280 and 1440 CSS pixels, both modes and all bands. Fixed danger-button foreground aliasing and dark error-copy contrast discovered by axe. Icon glyphs remain readable, chart values use accurate geometry, surfaces stay opaque under copy, and decoration is noninteractive. A 1280×800 wall viewport is included; lower sections intentionally scroll rather than shrinking controls.
4. **Final review:** captured every page × mode × band in Chromium 158 plus mobile and wall views. Original botanical paths use shared cubic tangents; no perfect circular halos or fixed words. These are qualitative art/UX judgments, not measured artistic scores or a usability study.

## Results

| Check | Result |
| --- | --- |
| `pnpm check` | Pass: schema validation, deterministic generation/drift, agent budgets, semantic contrast across nine eras × two modes, and no runtime imports. |
| `pnpm lint` | Pass. |
| Groovy unit tests | 3/3 pass: offline assets/agent budget, closed continuous original SVG geometry, all canonical components/layout-only example CSS. |
| Non-browser unit suite | 79/80 pass. The unchanged Memphis ornament validator rejects `oklch(58% 0.14 250)` because its color regular expression only accepts the function prefix, not a full functional color. The same value exists on the base commit. No unrelated validator edit included. |
| Chromium responsive acceptance | 72/72 pass (two pages × six widths × two modes × three bands); no detected horizontal clipping or undersized tested controls. |
| Chromium axe WCAG A/AA audits | 24/24 pass (both pages, 390/1280 widths, both modes, all three bands). Automated audits do not establish complete accessibility conformance. |
| Keyboard/interaction review | Tabs, menus, slider values, switches and checkboxes exercised at all three bands; native dialog Escape dismissal, radio arrows, select choice, popover, toast and focus tooltip verified in Chromium. |
| React build and typecheck | Pass; public wrapper sources unchanged. |
| MCP smoke | Pass, including standalone packed-package smoke; used a workspace-local npm cache. |
| Website instruction evaluation | Pass. Its unrelated runtime reports were not included in the change. |
| Full CLI browser suites/eval/skill verification | Local Playwright process launch blocked by macOS MachPortRendezvous permission error. The existing browser unit run was stopped after that repeated launch failure. Browser evidence above comes from the supported Chromium preview, not a claim that those CLI suites passed. |
| `pnpm sizes:check` | Fails the existing global limit: 61,709 gzip bytes versus 40,782 allowed. Base `main` already measures 61,096. Limit/baseline left unchanged. |

The reproducible Groovy Playwright/axe runner is wired into CI before the existing unit/size gates. Forced-colors and reduced-motion handling is implemented and covered by that runner; full operating-system assistive-technology review, actual wall-display hardware testing, Firefox and Safari review remain outstanding.

## Size and scope

| Asset | Base | Updated |
| --- | ---: | ---: |
| Full CSS, raw bytes | 445,703 | 420,939 |
| Full CSS, gzip bytes | 61,096 | 61,709 |
| Groovy CSS, raw bytes | 65,348 | 39,564 |
| Groovy CSS, gzip bytes | 6,671 | 7,683 |
| Added local display font | — | 22,712 |

No package/lockfile, runtime dependency, external runtime asset, public component spec, element implementation, or React wrapper change. The generator, Groovy specs/tokens, their generated outputs, local font, examples, targeted tests and review evidence are the change scope. No merge was performed.

## Screenshots

[Costume light](../demos/reference/shots/groovy/home-light-costume.jpg) · [Costume dark](../demos/reference/shots/groovy/home-dark-costume.jpg) · [Standard](../demos/reference/shots/groovy/home-light-standard.jpg) · [Whisper](../demos/reference/shots/groovy/home-light-whisper.jpg) · [Mobile](../demos/reference/shots/groovy/home-dark-costume-mobile.jpg) · [Wall viewport](../demos/reference/shots/groovy/home-light-costume-wall.jpg)

[Gallery Costume](../demos/reference/shots/groovy/gallery-light-costume.jpg) · [Gallery Standard](../demos/reference/shots/groovy/gallery-light-standard.jpg) · [Gallery Whisper](../demos/reference/shots/groovy/gallery-light-whisper.jpg). Dark counterparts and the machine-readable Chromium report are in the same folder.
