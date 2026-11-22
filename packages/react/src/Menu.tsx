import * as React from 'react';

export type MenuProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "default";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Action menu using Popover API + menu roles. Full APG WC may deepen later. */
export const Menu = React.forwardRef<HTMLElement, MenuProps>(function Menu(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-menu', className].filter(Boolean).join(' ');
  return React.createElement(
    'ew-menu',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Menu.displayName = 'Menu';
