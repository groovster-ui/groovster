import * as React from 'react';

export type SearchProps = Omit<React.HTMLAttributes<HTMLElement>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Search field with a leading icon, clear button, and optional scope. */
export const Search = React.forwardRef<HTMLElement, SearchProps>(function Search(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-search", className].filter(Boolean).join(' ');
  return React.createElement(
    "search",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Search.displayName = "Search";
