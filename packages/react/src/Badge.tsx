import * as React from 'react';

export type BadgeProps = Omit<React.ComponentPropsWithoutRef<'span'>, 'size'> & {
  variant?: "count" | "dot" | "neutral";
  size?: "sm" | "md";
};

/** Count or status dot for labels, nav, and reactions. */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-badge", className].filter(Boolean).join(' ');
  return React.createElement(
    "span",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Badge.displayName = "Badge";
