GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen

# Boutique ecommerce (commerce)
A scannable product grid with filters and a cart. Checkout collects a fictional order and charges nothing.
Category: Small catalog, filters, and a fictional cart
Eras: groovy, deco, memphis, art-nouveau. Also: neutral, mcm-atomic, neon, bauhaus, swiss. Avoid: none.
Fidelity: page standard; forms standard; data whisper. Standard keeps product prices and filters clearer than full costume. Costume remains available from the switcher.
Sections: masthead, filters, catalog, cart. Optional: note.
Components: button, card, select, checkbox, dialog, text-field, alert, link. Optional: toast.
Layout: Filter bar above a wrapping product grid. Prices and names stay in the same card anatomy in every era.
Responsive (800px): One column of products below 800px. Two columns from 800px. Three when the row fits.
Type: Product name and price are the scan line. Body face for materials. Display face only in the masthead.
Spacing: Even card gaps. Do not let ornament consume the price.
Density: comfortable.
Interactions: Category select and in-stock checkbox filter the grid. Add updates a cart count. Checkout dialog confirms a fictional order.
A11y: Each product has a heading. Filter select and checkbox have visible labels. Cart count is a live region. Dialog names the fictional checkout.
Ornament: Era chrome on cards and buttons. Hero hooks so a costume switch still has a stage or panel. Avoid: Decorative type on prices. Filters built from unstyled divs.
Deviations: neon|mcm-atomic|deco: Masthead includes stage and panel hooks. Page CSS may shorten the hero so the first products stay visible. art-nouveau: Organic hero uses the canonical .ew-hero__stage; keep forms unornamented.
Demo: demos/recipes/commerce/index.html (groovy, light, standard).
Same HTML for every era. Set data-era, data-mode, and data-fidelity-band on the root.
Anatomy: references/anatomy.md. Component notes: references/llms/<component>.md.
