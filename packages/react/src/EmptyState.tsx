import * as React from 'react';

export type EmptyStateProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Title, short explanation, and an optional action when a list or card is empty. */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-empty-state", className].filter(Boolean).join(' ');
  return React.createElement(
    "div",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
EmptyState.displayName = "EmptyState";
