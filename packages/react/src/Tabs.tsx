import * as React from 'react';

export type TabsProps = Omit<React.HTMLAttributes<HTMLElement>, 'size'> & {
  variant?: "line" | "enclosed" | "pills";
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
};

/** Tablist + tabpanels. Phase 0 specifies the contract; Phase 1 ships a light-DOM web component for keyboard behavior. */
export const Tabs = React.forwardRef<HTMLElement, TabsProps>(function Tabs(
  { className, variant, orientation, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (orientation != null) dataProps["data-orientation"] = orientation;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-tabs", className].filter(Boolean).join(' ');
  return React.createElement(
    "ew-tabs",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Tabs.displayName = "Tabs";
