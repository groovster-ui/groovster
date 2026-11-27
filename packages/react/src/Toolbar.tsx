import * as React from 'react';

export type ToolbarProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** App bar with start, center, and end slots. Optional sticky and overflow. */
export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-toolbar", className].filter(Boolean).join(' ');
  return React.createElement(
    "div",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Toolbar.displayName = "Toolbar";
