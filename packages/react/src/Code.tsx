import * as React from 'react';

export type CodeProps = Omit<React.HTMLAttributes<HTMLElement>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Inline or block code in the era monospace, with a copy slot. */
export const Code = React.forwardRef<HTMLElement, CodeProps>(function Code(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-code", className].filter(Boolean).join(' ');
  return React.createElement(
    "ew-code",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Code.displayName = "Code";
