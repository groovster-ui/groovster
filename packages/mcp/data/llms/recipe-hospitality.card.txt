GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen

# Premium hospitality (hospitality)
A polished stay page: rooms, a short visit story, and a reservation request. The request does not hold a room.
Category: Hotel, inn, or reservation-led stay
Eras: deco, mcm-atomic, art-nouveau. Also: groovy, neutral, memphis, neon. Avoid: none.
Fidelity: page costume; forms standard; data whisper. Costume for the arrival story and room cards. The request form uses ordinary labels and native fields.
Sections: masthead, rooms, reserve, visit. Optional: policies.
Components: button, card, dialog, text-field, select, radio, textarea, alert, ornament-divider, link. Optional: popover.
Layout: Arrival hero, room cards, then a reservation form. Room art is local CSS, not a remote photograph.
Responsive (800px): Stack room cards and form fields. Keep the request button on screen after the fields.
Type: Property name in the display face. Room names and rates easy to compare. Form labels in the body face.
Spacing: Generous hero and room cards. Compact, aligned form rows.
Density: comfortable.
Interactions: Choose a room with radios. Submit opens a confirmation alert and dialog stating the request is fictional. A popover can show rate notes without leaving the page.
A11y: Room choice is a radio group. Dates, guests, and notes have visible labels. Confirmation is a status alert, not color alone. Popover is the Popover API.
Ornament: Costume hero appropriate to the era. A divider between rooms and the request. Avoid: Ornament that covers the rate. Placeholder text as the only label.
Deviations: deco: Arrival copy uses .ew-hero__panel, rays, and fan. neon|mcm-atomic: The same hero includes .ew-hero__stage. Do not restyle the form with a second HTML tree. art-nouveau: Organic hero uses the canonical .ew-hero__stage; keep forms unornamented.
Demo: demos/recipes/hospitality/index.html (deco, light, costume).
Same HTML for every era. Set data-era, data-mode, and data-fidelity-band on the root.
Anatomy: references/anatomy.md. Component notes: references/llms/<component>.md.
