import * as React from 'react';

export type SkeletonProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'size'> & {
  variant?: "line" | "block";
  size?: "sm" | "md";
};

/** Placeholder while content loads. Still when motion is reduced. */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-skeleton", className].filter(Boolean).join(' ');
  return React.createElement(
    "div",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Skeleton.displayName = "Skeleton";
