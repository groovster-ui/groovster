# Era Widgets — agent notes (generated)

Use **HTML** with `ew-*` classes. Flip eras with `data-era` (deco|earth|groovy|mcm-atomic|memphis|neon|neutral).

Fidelity is **bands only**: `data-fidelity-band="whisper|default|costume"` (`signature` aliases `default`).
**Costume is the default** when the attribute is absent; set whisper/default to opt down.
The band may be on the era element or an ancestor.

```html
<link rel="stylesheet" href="node_modules/@groovster/css/era-widgets.css" />
<div data-era="deco" data-mode="light">
  <button type="button" class="ew-button">Save</button>
</div>
```

MCP tools: list_eras, get_era_spec, get_component, install, recommend, validate.
Load only the llms section you need from `generated/llms/`.
