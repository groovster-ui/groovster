GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen

# Streaming shelf (streaming)
A title hero, horizontal shelves of posters, and a detail dialog. Posters keep a fixed ratio.
Category: Hero, shelves, and a title dialog
Eras: neutral. Also: swiss, bauhaus, deco, groovy, memphis, mcm-atomic, neon, art-nouveau. Avoid: none.
Fidelity: page whisper; forms whisper; data whisper. Compact density. Costume stays on the hero only when the page has one.
Sections: hero, shelves, detail. Optional: none.
Components: toolbar, shelf, media-card. Optional: dialog, pagination.
Layout: Sticky toolbar, hero, then scroll-snap shelves.
Responsive (800px): Panes stack. Toolbars wrap. No horizontal page scroll at 390.
Type: Body face on controls and card titles in compact density. Display face on the page title.
Spacing: Use data-density=compact so card padding is about 10px.
Density: compact.
Interactions: Scroll a shelf. Open the title dialog.
A11y: Shelf cards are links with names. The dialog has a label. Reduced motion keeps the shelf still.
Ornament: Era palette, price, and chips. Avoid: Pattern behind body text. Full frames on every card.
Deviations: deco|groovy|neon|mcm-atomic|memphis: Era character stays in palette, type, and one accent. Quiet cards inside compact density.
Demo: demos/apps-dense/stream/index.html (neon, dark, costume).
Same HTML for every era. Set data-era, data-mode, and data-fidelity-band on the root.
Anatomy: references/anatomy.md. Component notes: references/llms/<component>.md.
