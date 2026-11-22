import * as React from 'react';

export type CardProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "raised" | "inset" | "outline" | "flat";
  size?: "sm" | "md" | "lg";
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Surface container for grouped content. Cards are interaction containers — eras rewrite edge, elevation, and ornament. */
export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-card', className].filter(Boolean).join(' ');
  return React.createElement(
    'article',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Card.displayName = 'Card';
