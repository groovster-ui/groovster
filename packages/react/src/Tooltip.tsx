import * as React from 'react';

export type TooltipProps = Omit<React.HTMLAttributes<HTMLElement>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md" | "lg";
};

/** CSS tooltip for non-essential hints. Never the only accessible name. */
export const Tooltip = React.forwardRef<HTMLElement, TooltipProps>(function Tooltip(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-tooltip", className].filter(Boolean).join(' ');
  return React.createElement(
    "ew-tooltip",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Tooltip.displayName = "Tooltip";
