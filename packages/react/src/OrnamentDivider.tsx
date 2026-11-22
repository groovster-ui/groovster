import * as React from 'react';

export type OrnamentDividerProps = Omit<React.ComponentPropsWithoutRef<'hr'>, 'size'> & {
  variant?: "line" | "ornament";
  size?: "sm" | "md" | "lg";
};

/** Structural divider; eras supply ornament via decorators. */
export const OrnamentDivider = React.forwardRef<HTMLHRElement, OrnamentDividerProps>(function OrnamentDivider(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-ornament-divider", className].filter(Boolean).join(' ');
  return React.createElement(
    "hr",
    { ref, ...rest, className: cls, ...dataProps }
  );
});
OrnamentDivider.displayName = "OrnamentDivider";
