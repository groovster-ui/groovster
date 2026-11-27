import * as React from 'react';

export type ChipProps = Omit<React.HTMLAttributes<HTMLElement>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Filter, label, or removable token. Selectable chips use aria-pressed. */
export const Chip = React.forwardRef<HTMLElement, ChipProps>(function Chip(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-chip", className].filter(Boolean).join(' ');
  return React.createElement(
    "ew-chip",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Chip.displayName = "Chip";
