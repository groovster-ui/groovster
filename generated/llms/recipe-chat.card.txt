GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen

# Chat workspace (chat)
A channel rail, a thread of messages, and a composer. Presence uses shape as well as colour.
Category: Channels and a thread
Eras: neutral. Also: swiss, bauhaus, deco, groovy, memphis, mcm-atomic, neon, art-nouveau. Avoid: none.
Fidelity: page whisper; forms whisper; data whisper. Compact density. Costume stays on the hero only when the page has one.
Sections: channels, thread, composer. Optional: none.
Components: toolbar, list, avatar, search. Optional: typing-indicator.
Layout: Toolbar, channel rail, thread, composer.
Responsive (800px): Panes stack. Toolbars wrap. No horizontal page scroll at 390.
Type: Body face on controls and card titles in compact density. Display face on the page title.
Spacing: Use data-density=compact so card padding is about 10px.
Density: compact.
Interactions: Switch channels. Send a sample reply.
A11y: Presence dots differ by shape. The composer has a label. The toolbar sits inside a header landmark.
Ornament: Era palette, price, and chips. Avoid: Pattern behind body text. Full frames on every card.
Deviations: deco|groovy|neon|mcm-atomic|memphis: Era character stays in palette, type, and one accent. Quiet cards inside compact density.
Demo: demos/apps-dense/chat/index.html (neutral, light, whisper).
Same HTML for every era. Set data-era, data-mode, and data-fidelity-band on the root.
Anatomy: references/anatomy.md. Component notes: references/llms/<component>.md.
