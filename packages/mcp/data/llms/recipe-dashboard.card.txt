GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen

# Operational dashboard (dashboard)
A compact board for status, filters, and tables. Clarity outranks ornament. Figures are fictional.
Category: Dense operational board, queue, or internal tool
Eras: neutral, swiss. Also: earth, deco, groovy, memphis, mcm-atomic, neon, bauhaus. Avoid: none.
Fidelity: page whisper; forms whisper; data whisper. Whisper is the default so tables and filters stay quiet. Costume may be switched on; it must not hide rows or labels.
Sections: masthead, metrics, filters, queues. Optional: notes.
Components: button, card, tabs, select, text-field, switch, alert, link. Optional: menu.
Layout: One compact bar, a metric row, filters, then tabbed tables. Do not use a full-viewport .ew-hero. There is no table component; use a native table.
Responsive (800px): Metrics wrap. Filters wrap. Tables scroll inside a region instead of widening the page.
Type: Body or mono for figures. Short labels. Display faces stay off controls and table cells.
Spacing: 8 to 12 pixel gaps. Row padding stays compact in page CSS, not a new global density token.
Density: compact.
Interactions: Search and status filter the rows. Tabs switch queues. The switch explains that the sample clock is frozen.
A11y: Tables have captions and column headers. Search has a visible label. Filter changes update a live count. Tabs are ew-tabs. Do not rely on color for status; include a text status.
Ornament: Era chrome on cards, tabs, and controls. A single warning alert for the fictional data. Avoid: Full-bleed costume hero. Sparkline libraries. Status shown only by color.
Deviations: neon|deco|mcm-atomic|memphis|groovy|earth: Switching era changes control geometry and type. Do not add .ew-hero. If costume ornament competes with the table, drop the page to standard or whisper.
Demo: demos/recipes/dashboard/index.html (neutral, light, whisper).
Same HTML for every era. Set data-era, data-mode, and data-fidelity-band on the root.
Anatomy: references/anatomy.md. Component notes: references/llms/<component>.md.
