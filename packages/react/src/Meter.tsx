import * as React from 'react';

export type MeterProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'size'> & {
  variant?: "linear" | "radial";
  size?: "sm" | "md";
};

/** Labeled linear meter or progress, plus a small radial. */
export const Meter = React.forwardRef<HTMLDivElement, MeterProps>(function Meter(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-meter", className].filter(Boolean).join(' ');
  return React.createElement(
    "div",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Meter.displayName = "Meter";
