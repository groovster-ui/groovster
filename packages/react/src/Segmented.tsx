import * as React from 'react';

export type SegmentedProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** A single-choice control with radiogroup semantics. */
export const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(function Segmented(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-segmented", className].filter(Boolean).join(' ');
  return React.createElement(
    "div",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Segmented.displayName = "Segmented";
