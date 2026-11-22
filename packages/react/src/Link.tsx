import * as React from 'react';

export type LinkProps = Omit<React.ComponentPropsWithoutRef<'a'>, 'size'> & {
  variant?: "default" | "subtle" | "nav";
  size?: "sm" | "md" | "lg";
};

/** Text link with era underline/voice. */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-link", className].filter(Boolean).join(' ');
  return React.createElement(
    "a",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Link.displayName = "Link";
