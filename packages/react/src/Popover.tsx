import * as React from 'react';

export type PopoverProps = Omit<React.HTMLAttributes<HTMLElement>, 'size'> & {
  variant?: "default" | "rich";
  size?: "sm" | "md" | "lg";
};

/** Non-modal popover surface via Popover API. */
export const Popover = React.forwardRef<HTMLElement, PopoverProps>(function Popover(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-popover", className].filter(Boolean).join(' ');
  return React.createElement(
    "ew-popover",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Popover.displayName = "Popover";
