import * as React from 'react';

export type BreadcrumbProps = Omit<React.ComponentPropsWithoutRef<'nav'>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md" | "lg";
};

/** Navigation breadcrumb trail. */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-breadcrumb", className].filter(Boolean).join(' ');
  return React.createElement(
    'nav',
    { ref, className: cls, ...dataProps, ...rest, 'aria-label': rest['aria-label'] ?? 'Breadcrumb' },
    React.createElement('ol', { className: "ew-breadcrumb__list" }, children)
  );
});
Breadcrumb.displayName = "Breadcrumb";
