GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen

# Event or festival (event)
A poster-like event page with a lineup, a schedule, and ticket choice. The hold is fictional and takes no payment.
Category: Ticketed event, festival, or performance series
Eras: neon, memphis, groovy, mcm-atomic. Also: deco, earth, neutral, bauhaus, swiss. Avoid: none.
Fidelity: page costume; forms standard; data standard. Costume on the poster hero. Ticket choices stay a labeled radio group.
Sections: masthead, lineup, schedule, tickets. Optional: visit.
Components: button, link, card, tabs, radio, dialog, alert, ornament-divider. Optional: toast, select.
Layout: Poster hero, then act cards, then day tabs with a schedule table, then ticket radios. The same section order is used in every era.
Responsive (800px): Stack act cards and ticket options. Wrap the schedule table in a horizontal scroller.
Type: Oversized event name. Readable table and radio labels. No display face on the ticket controls.
Spacing: Tight poster type, then clear gaps between lineup, schedule, and tickets.
Density: comfortable.
Interactions: Day tabs change the schedule. Review opens a native dialog that states the hold is fictional.
A11y: Ticket tiers are radios in a fieldset. Dialog is a native dialog with a name. Schedule tables use column headers. Day tabs are ew-tabs.
Ornament: Full costume hero, including neon stage or deco panel when that era is active. One divider before tickets. Avoid: Ornament inside table cells. Glow as the only way to see the selected tier.
Deviations: neon|mcm-atomic: Hero includes .ew-hero__stage with sun, mountains, and grid plus atomic twotone, starbursts, arch, and orbit. deco: Hero copy sits in .ew-hero__panel. Lineup and schedule markup stay the same.
Demo: demos/recipes/event/index.html (neon, dark, costume).
Same HTML for every era. Set data-era, data-mode, and data-fidelity-band on the root.
Anatomy: references/anatomy.md. Component notes: references/llms/<component>.md.
