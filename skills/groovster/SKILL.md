---
name: groovster
description: >-
  Builds distinctive, responsive, accessible websites with Groovster era skins
  and website recipes. Use when the user asks for a website, landing page,
  magazine, festival, shop, hotel, booking flow, dashboard, or a visual era
  such as art deco, synthwave, Memphis, mid-century, or groovy. Works without
  an account, API key, or frontend framework.
---

# Groovster websites

Groovster skins HTML. Do not add React, Tailwind, or a component library. One HTML tree serves every era. Set `data-era`, `data-mode`, and `data-fidelity-band` on a root.

## Steps

1. Name the product in one sentence. Pick one recipe: `editorial`, `event`, `commerce`, `hospitality`, `dashboard`.
2. Read only `references/<recipe>.md`.
3. Choose an era from that card.
4. Set fidelity from the card. Dashboards and tables default to `whisper`.
5. Write the required sections in order.
6. Mark up controls from `references/anatomy.md` or `references/llms/<component>.md`. Copy one component at a time.
7. Add the smallest vanilla script for filters, dialogs, and fictional submits. Load `@groovster/elements/era-elements.js` for tabs, select, menu, popover, tooltip, toast, or slider.
8. Stack below 800px. Do not set `outline: none`.
9. Check: one `h1`, visible labels, native buttons and dialogs, hero hooks for costume neon/atomic/deco, no remote images or fonts, fictional payments labeled as fictional.
10. Switch `data-era` across the eras. Do not fork the HTML per era.

## Era and fidelity

Eras: `neutral`, `deco`, `groovy`, `mcm-atomic`, `memphis`, `neon`, `swiss`, `bauhaus`, `art-nouveau`.

Bands: `whisper`, `standard`, `costume`. Costume is the default when the attribute is absent.

Costume heroes keep one structure: backdrop, stage, and panel, as in `references/anatomy.md`. Each era's CSS places that tree. Dashboards omit `.ew-hero`.

## CSS

Link `base.css`, the components you use, and each era the page can switch to. A page that switches every era may link `era-widgets.css`. Fonts are OFL WOFF2 beside the CSS.

## MCP

Optional. Call `recommend` or `find_recipe`, then `get_component` only for a widget you are about to write. Without MCP, the recipe card and anatomy file are enough.

## Install

Cursor reads `.cursor/skills/`. Claude Code reads `.claude/skills/`. Codex reads `.agents/skills/`. Copy this folder. See `docs/agents.md` in the Groovster repo. There is no hosted service.
