import * as React from 'react';

export type CardProps = Omit<React.ComponentPropsWithoutRef<'article'>, 'size'> & {
  variant?: "raised" | "inset" | "outline" | "flat";
  size?: "sm" | "md" | "lg";
};

/** Surface container for grouped content. Cards are interaction containers — eras rewrite edge, elevation, and ornament. */
export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-card", className].filter(Boolean).join(' ');
  return React.createElement(
    "article",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Card.displayName = "Card";
