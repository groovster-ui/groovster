# Groovy print grammar

Use ordinary Groovster canonical HTML with `data-era="groovy"`. Costume is the default; `data-fidelity-band="standard"` and `"whisper"` reduce expression. `data-mode="dark"` supplies plum night surfaces. No application-specific decorative CSS, network assets, new runtime package or changed component contract is required.

## Sources and generation

Edit `spec/eras/groovy/era.spec.json`, the four Groovy token files, and `spec/eras/groovy/print.spec.json` first. `tools/gen/src/groovy-decorators.js` is the build-time adapter; `pnpm gen` regenerates CSS, MCP data and agent cards. Do not edit generated files. The small era card links here for details rather than making agents read this document for every task.

The print spec owns palette, ribbon geometry, flower parameters and band geometry. Botanical outlines are original closed cubic Bézier curves with matching tangents at every join. The same outline is reused at different scales, with non-scaling strokes. Continuous broad contours replace abrupt ribbon bends; no circular flower halos, embedded heading words, copied artwork or runtime ornament generator is used.

Spicy Rice (400) carries display headings and expressive buttons; Mulish remains on labels, editing controls and dense data. The unmodified 22,712-byte Latin WOFF2 is bundled from Fontsource 5.3.0, with its [upstream OFL license](https://github.com/google/fonts/blob/main/ofl/spicyrice/OFL.txt) included in the existing font license file. Typography is real selectable text, so arbitrary headings work. Icon buttons use body glyphs rather than the display font.

## Fidelity

| Band | Treatment |
| --- | --- |
| Costume | Cream lettering in plum/raspberry/teal cartouches; nested print contours; asymmetric panel outlines; full original ribbon/botanical hero. |
| Standard | Display headings and action lettering; single sculpted borders; restrained color; no full print field or ornamental frame. |
| Whisper | Fine asymmetric corners, warm paper/plum surfaces, display headings, readable body-type actions; no decorative field or frame. |

Legacy `default` and `signature` retain their Standard behavior. Modes preserve meaningful focus, checked, invalid, selected and disabled states. Decoration is static and never intercepts pointer events. Reduced-motion and forced-color treatments are supplied by the skin.

## Component coverage

All 21 current component specs and their canonical HTML were inspected. Their contracts and the element/React public APIs are unchanged.

| Component | Groovy treatment |
| --- | --- |
| Alert | Organic edge, readable body text and a semantic side rule. |
| Avatar | Teal/cream initials, ink edge and Costume print rim; circle/square variants retained. |
| Breadcrumb | Compact body text, wavy link underlines and clear current location. |
| Button | Sculpted cartouche, cream display lettering, distinct primary/secondary/danger/ghost states. |
| Card | Compact padding, alternate organic silhouettes, fitted display headers and removable flat/outline ornament. |
| Checkbox | Asymmetric box, high-contrast check mark, full label hit area. |
| Dialog | Native modal, organic print frame and separated title/content/actions. |
| Icon button | 44px target, legible body glyph and sculpted contour. |
| Link | Wavy text underline; sculpted nav links with a distinct current state. |
| Menu | Opaque organic panel and clear keyboard/hover item states. |
| Ornament divider | Continuous two-color wave; line variant stays a rule. |
| Popover | Shared organic panel, native top-layer behavior retained. |
| Radio | Native group semantics, ink ring and an organic selected dot. |
| Select | Readable native/enhanced control, ink outline and warm inset edge. |
| Slider | Accurate native range, restrained track and sculpted marigold thumb. |
| Switch | Distinct on/off track, moving contrasting thumb and full label target. |
| Tabs | Sculpted display labels, marigold selected state and preserved keyboard navigation. |
| Text field | Body-type input, organic corner geometry and explicit invalid border. |
| Textarea | Readable editing surface with organic panel corners. |
| Toast | Compact status surface, readable copy and existing live-region behavior. |
| Tooltip | Plum/cream hint surface; optional information remains separate from the accessible name. |

There is no chart or gauge component in the current public API. Native `meter`, `progress`, `figure`, `figcaption`, `table` and accessible data SVG inside an ordinary card receive matching era styling. Applications still supply truthful data geometry, labels, scales and textual equivalents. The reference chart uses a linear scale and the gauge encodes 86% through its actual path length; decoration never fabricates values.

## Examples and verification

- Dense fictional home: `demos/reference/groovy-home/index.html`
- Every component: `demos/showcase/groovy.html`
- Shared example CSS contains composition/spacing only, with no era-specific decorative selectors.
- Reproduce browser acceptance: `node scripts/groovy-browser.mjs --capture` using the already installed Playwright and axe development tools.
- Run normal repository checks: `pnpm check`, `pnpm lint`, `pnpm test:unit`, `pnpm sizes:check`.
- Review evidence and limitations: [Groovy review](groovy-review.md).
