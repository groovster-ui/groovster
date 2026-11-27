import * as React from 'react';

export type NavRailProps = Omit<React.ComponentPropsWithoutRef<'nav'>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Sidebar items with an icon, label, and count. Collapses to icons. */
export const NavRail = React.forwardRef<HTMLElement, NavRailProps>(function NavRail(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-nav-rail", className].filter(Boolean).join(' ');
  return React.createElement(
    "nav",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
NavRail.displayName = "NavRail";
