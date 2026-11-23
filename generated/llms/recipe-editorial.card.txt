GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen

# Editorial publication (editorial)
A reading-first publication. Display type carries the issue; body copy stays quiet and long enough to read.
Category: Magazine, journal, or essay-led publication
Eras: earth, deco, neutral, swiss. Also: groovy, mcm-atomic, memphis, neon, bauhaus, art-nouveau. Avoid: none.
Fidelity: page costume; forms standard; data whisper. Costume on the masthead. Keep the essay and newsletter controls free of display faces.
Sections: masthead, story, departments, newsletter. Optional: archive.
Components: link, button, card, tabs, text-field, checkbox, alert, ornament-divider, avatar, breadcrumb. Optional: textarea.
Layout: Full-bleed masthead, then a narrow measure for the essay. Department stories sit in a wrapping grid, not a component gallery.
Responsive (800px): Stack the essay and side note. Let the nav wrap. Do not shrink body text below 1rem.
Type: Display face on the masthead and story title only. Body face for the essay. No display face on buttons, fields, or nav.
Spacing: Large space before the essay, tight space inside paragraphs, generous gap between departments.
Density: immersive.
Interactions: Department tabs switch story groups. Newsletter submit confirms locally and states that no list is contacted.
A11y: One h1. Visible labels on the email field and consent checkbox. Tabs use the ew-tabs element. Skip link to the essay.
Ornament: Masthead hero hooks for the active era. One ornament divider between the essay and departments. Avoid: Ornament behind body text. A costume divider between every paragraph.
Deviations: neon|mcm-atomic: Keep .ew-hero__stage in the masthead so costume sun, grid, starbursts, and arch can render. Cap stage height in page CSS so the essay starts on the first screen. deco: Wrap masthead copy in .ew-hero__panel with rays and fan. Do not rebuild the rest of the page.
Demo: demos/recipes/editorial/index.html (earth, light, costume).
Same HTML for every era. Set data-era, data-mode, and data-fidelity-band on the root.
Anatomy: references/anatomy.md. Component notes: references/llms/<component>.md.
