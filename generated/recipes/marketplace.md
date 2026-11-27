GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen

# Marketplace (marketplace)
A calm product grid with filters, prices, and a detail table. Era character stays in the price and chips.
Category: Product grid and detail
Eras: neutral. Also: swiss, bauhaus, deco, groovy, memphis, mcm-atomic, neon, art-nouveau. Avoid: none.
Fidelity: page whisper; forms whisper; data whisper. Compact density. Costume stays on the hero only when the page has one.
Sections: results, filters, detail. Optional: none.
Components: toolbar, card, search, table, product-card, price, rating, countdown, filter-group. Optional: badge, pagination.
Layout: Results header, category chips, grid, and a specifics table.
Responsive (800px): Panes stack. Toolbars wrap. No horizontal page scroll at 390.
Type: Body face on controls and card titles in compact density. Display face on the page title.
Spacing: Use data-density=compact so card padding is about 10px.
Density: compact.
Interactions: Sort and filter the grid. Open a listing.
A11y: Titles clamp to two lines. Prices are text, not colour alone. The table has a caption.
Ornament: Era palette, price, and chips. Avoid: Pattern behind body text. Full frames on every card.
Deviations: deco|groovy|neon|mcm-atomic|memphis: Era character stays in palette, type, and one accent. Quiet cards inside compact density.
Demo: demos/apps-dense/market/index.html (neutral, light, whisper).
Same HTML for every era. Set data-era, data-mode, and data-fidelity-band on the root.
Anatomy: references/anatomy.md. Component notes: references/llms/<component>.md.
