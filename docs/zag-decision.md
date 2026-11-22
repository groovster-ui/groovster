# Zag.js decision — hard widgets

**Decision:** Zag.js is **not used** for Era Widgets hard components.

| Widget | APG pattern | Implementation | Zag needed? |
|---|---|---|---|
| Tabs | Tabs | `<ew-tabs>` light-DOM WC | No — roving tabindex + arrow keys |
| Select | Select-only listbox | `<ew-select>` enhances native `<select>` | No — listbox + form sync |
| Menu | Menu button | `<ew-menu>` | No — menu/menuitem keyboard |
| Popover | Disclosure / Popover | `<ew-popover>` + Popover API fallback | No |
| Tooltip | Tooltip | `<ew-tooltip>` | No — focus/hover + Escape |
| Toast | Live region | `<ew-toast-region>.show()` | No |
| Slider | Slider | `<ew-slider>` + native range | No — native keyboard |

Revisit Zag only if a future pattern cannot meet APG keyboard/focus/ARIA with a small light-DOM WC (e.g. complex combobox typeahead with multi-select + grid). Published `@groovster/elements` must remain import-free.
