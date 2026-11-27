import * as React from 'react';

export type TableProps = Omit<React.HTMLAttributes<HTMLElement>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Era table with a caption, rules, optional zebra, and sortable headers. */
export const Table = React.forwardRef<HTMLElement, TableProps>(function Table(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-table", className].filter(Boolean).join(' ');
  return React.createElement(
    "table",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Table.displayName = "Table";
