import * as React from 'react';

export type FilterGroupProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Collapsible filter with counts and a show-more control. */
export const FilterGroup = React.forwardRef<HTMLDivElement, FilterGroupProps>(function FilterGroup(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-filter-group", className].filter(Boolean).join(' ');
  return React.createElement(
    "div",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
FilterGroup.displayName = "FilterGroup";
