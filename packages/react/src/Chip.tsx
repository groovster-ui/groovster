import * as React from 'react';

export type ChipProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Filter, label, or removable token. Selectable chips use aria-pressed. */
export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { className, variant, size, children, type = 'button', ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-chip", className].filter(Boolean).join(' ');
  return React.createElement(
    "button",
    { ref, ...rest, className: cls, type, ...dataProps },
    children
  );
});
Chip.displayName = "Chip";
