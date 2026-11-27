GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen

# Mail client (mail)
A dense inbox with folders, a message list, and a reader. Selection and unread are not colour alone.
Category: Three-pane inbox
Eras: neutral. Also: swiss, bauhaus, deco, groovy, memphis, mcm-atomic, neon, art-nouveau. Avoid: none.
Fidelity: page whisper; forms whisper; data whisper. Compact density. Costume stays on the hero only when the page has one.
Sections: folders, list, reader. Optional: none.
Components: toolbar, list, search, badge. Optional: dialog.
Layout: Toolbar, then a nav rail, list, and reader.
Responsive (800px): Panes stack. Toolbars wrap. No horizontal page scroll at 390.
Type: Body face on controls and card titles in compact density. Display face on the page title.
Spacing: Use data-density=compact so card padding is about 10px.
Density: compact.
Interactions: Select a row. Search filters the list.
A11y: The list is a listbox. Unread uses weight and a dot. The toolbar sits inside a header landmark.
Ornament: Era palette, price, and chips. Avoid: Pattern behind body text. Full frames on every card.
Deviations: deco|groovy|neon|mcm-atomic|memphis: Era character stays in palette, type, and one accent. Quiet cards inside compact density.
Demo: demos/apps-dense/mail/index.html (neutral, light, whisper).
Same HTML for every era. Set data-era, data-mode, and data-fidelity-band on the root.
Anatomy: references/anatomy.md. Component notes: references/llms/<component>.md.
