import * as React from 'react';

export type ListProps = Omit<React.HTMLAttributes<HTMLElement>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Dense row with a lead, truncated text, and trailing meta. Selected and unread states. */
export const List = React.forwardRef<HTMLElement, ListProps>(function List(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-list", className].filter(Boolean).join(' ');
  return React.createElement(
    "ul",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
List.displayName = "List";
