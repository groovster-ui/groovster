import { getOutRoot, outPath } from './paths.js';
import { writeText, rel } from './io.js';

const HEADER = '/* GENERATED FILE — do not edit. Source: spec/. Run: pnpm gen */\n';

export function generateDialectCss(outputs) {
  const css = `${HEADER}@layer era {
  /* mcm-atomic dialects */
  [data-era="mcm-atomic"][data-dialect="mcm"] {
    --ew-structure-surface-radius: 28px;
    --ew-structure-control-radius: 999px;
    --ew-structure-field-radius: 18px;
    --ew-structure-card-ornament-opacity: 0.12;
    --ew-structure-button-shadow: 0 2px 6px color-mix(in oklch, var(--ew-color-fg-default) 12%, transparent);
  }
  [data-era="mcm-atomic"][data-dialect="atomic"] {
    --ew-structure-surface-radius: 16px;
    --ew-structure-control-radius: 999px;
    --ew-structure-field-radius: 12px;
    --ew-structure-card-ornament-opacity: 0.28;
    --ew-structure-button-shadow: 5px 5px 0 0 color-mix(in oklch, var(--ew-color-fg-default) 20%, transparent);
    --ew-structure-card-raised-shadow: 8px 8px 0 0 color-mix(in oklch, var(--ew-color-fg-default) 18%, transparent);
  }

  /* neon dialects */
  [data-era="neon"][data-dialect="synthwave"],
  [data-era="neon"]:not([data-dialect]) {
    /* default night synthwave — tokens already encode this */
  }
  [data-era="neon"][data-dialect="miami"] {
    --ew-color-bg-page: oklch(95% 0.03 230);
    --ew-color-bg-surface: oklch(90% 0.04 320);
    --ew-color-bg-elevated: oklch(98% 0.02 320);
    --ew-color-fg-default: oklch(22% 0.05 300);
    --ew-color-fg-muted: oklch(40% 0.04 300);
    --ew-color-action-bg: oklch(55% 0.2 340);
    --ew-color-action-fg: oklch(98% 0.01 340);
    --ew-color-border-strong: oklch(60% 0.16 340);
    --ew-color-border-subtle: oklch(70% 0.08 210);
    --ew-structure-button-shadow: 0 0 0 1px color-mix(in oklch, var(--ew-color-border-subtle) 70%, transparent);
    --ew-structure-card-ornament-opacity: 0.1;
  }
}
`;
  const out = outPath('packages/css/dist/dialects.css');
  writeText(out, css);
  outputs.push(rel(getOutRoot(), out));
  return out;
}
