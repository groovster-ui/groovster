import * as React from 'react';

export type ShelfProps = Omit<React.HTMLAttributes<HTMLElement>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Horizontal title row with scroll-snap and keyboard access. */
export const Shelf = React.forwardRef<HTMLElement, ShelfProps>(function Shelf(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-shelf", className].filter(Boolean).join(' ');
  return React.createElement(
    "ew-shelf",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Shelf.displayName = "Shelf";
