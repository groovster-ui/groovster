import * as React from 'react';

export type DensityProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'size'> & {
  density?: "comfortable" | "compact";
  size?: "sm" | "md";
};

/** App heading scale and compact or comfortable density. Quiet cards and body type on controls. */
export const Density = React.forwardRef<HTMLDivElement, DensityProps>(function Density(
  { className, density, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (density != null) dataProps["data-density"] = density;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-density", className].filter(Boolean).join(' ');
  return React.createElement(
    "div",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Density.displayName = "Density";
