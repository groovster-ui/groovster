import * as React from 'react';

export type MenuProps = Omit<React.HTMLAttributes<HTMLElement>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md" | "lg";
};

/** Action menu using Popover API + menu roles. Full APG WC may deepen later. */
export const Menu = React.forwardRef<HTMLElement, MenuProps>(function Menu(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-menu", className].filter(Boolean).join(' ');
  return React.createElement(
    "ew-menu",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Menu.displayName = "Menu";
