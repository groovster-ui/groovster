import * as React from 'react';

export type PaginationProps = Omit<React.HTMLAttributes<HTMLElement>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Previous, next, and page links. The current page uses aria-current. */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-pagination", className].filter(Boolean).join(' ');
  return React.createElement(
    "ew-pagination",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Pagination.displayName = "Pagination";
