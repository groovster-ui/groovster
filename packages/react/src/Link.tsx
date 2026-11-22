import * as React from 'react';

export type LinkProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "subtle" | "nav";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Text link with era underline/voice. */
export const Link = React.forwardRef<HTMLElement, LinkProps>(function Link(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-link', className].filter(Boolean).join(' ');
  return React.createElement(
    'a',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Link.displayName = 'Link';
