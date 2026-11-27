import * as React from 'react';

export type ProductCardProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Fixed-ratio listing with a two-line title and a price. */
export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(function ProductCard(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-product-card", className].filter(Boolean).join(' ');
  return React.createElement(
    "div",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
ProductCard.displayName = "ProductCard";
