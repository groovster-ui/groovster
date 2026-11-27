GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen

# Personal site (personal)
A personal page with a hero, a section heading, a feature card, and a code sample.
Category: One-page studio
Eras: neutral. Also: swiss, bauhaus, deco, groovy, memphis, mcm-atomic, neon, art-nouveau. Avoid: none.
Fidelity: page costume; forms standard; data whisper. The hero is costume. The work card can keep a feature frame.
Sections: hero, work, notes. Optional: none.
Components: toolbar, card, code. Optional: nav-rail.
Layout: Toolbar, hero, then a single column of work.
Responsive (800px): Panes stack. Toolbars wrap. No horizontal page scroll at 390.
Type: Body face on controls and card titles in compact density. Display face on the page title.
Spacing: Use data-density=compact so card padding is about 10px.
Density: compact.
Interactions: Jump to a section. Copy the code sample.
A11y: One h1 in the hero. The code sample is text. Links have a 4.5:1 contrast.
Ornament: Era palette, price, and chips. Avoid: Pattern behind body text. Full frames on every card.
Deviations: deco|groovy|neon|mcm-atomic|memphis: Era character stays in palette, type, and one accent. Quiet cards inside compact density.
Demo: demos/apps-dense/site/index.html (deco, light, costume).
Same HTML for every era. Set data-era, data-mode, and data-fidelity-band on the root.
Anatomy: references/anatomy.md. Component notes: references/llms/<component>.md.
