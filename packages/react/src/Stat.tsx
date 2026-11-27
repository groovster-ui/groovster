import * as React from 'react';

export type StatProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** A value, a label, and an up or down delta that is not color alone. */
export const Stat = React.forwardRef<HTMLDivElement, StatProps>(function Stat(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-stat", className].filter(Boolean).join(' ');
  return React.createElement(
    "div",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Stat.displayName = "Stat";
