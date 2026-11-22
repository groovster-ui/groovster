import * as React from 'react';

export type BreadcrumbProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "default";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Navigation breadcrumb trail. */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-breadcrumb', className].filter(Boolean).join(' ');
  return React.createElement(
    'nav',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Breadcrumb.displayName = 'Breadcrumb';
