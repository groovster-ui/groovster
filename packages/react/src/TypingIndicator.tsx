import * as React from 'react';

export type TypingIndicatorProps = Omit<React.ComponentPropsWithoutRef<'span'>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Three dots while someone is typing. Static when motion is reduced. */
export const TypingIndicator = React.forwardRef<HTMLSpanElement, TypingIndicatorProps>(function TypingIndicator(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-typing-indicator", className].filter(Boolean).join(' ');
  return React.createElement(
    "span",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
TypingIndicator.displayName = "TypingIndicator";
