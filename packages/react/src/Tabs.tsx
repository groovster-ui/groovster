import * as React from 'react';

export type TabsProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "line" | "enclosed" | "pills";
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Tablist + tabpanels. Phase 0 specifies the contract; Phase 1 ships a light-DOM web component for keyboard behavior. */
export const Tabs = React.forwardRef<HTMLElement, TabsProps>(function Tabs(
  { className, children, variant, orientation, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (orientation != null) dataProps["data-orientation"] = orientation;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-tabs', className].filter(Boolean).join(' ');
  return React.createElement(
    'ew-tabs',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Tabs.displayName = 'Tabs';
