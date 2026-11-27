import * as React from 'react';

export type CountdownProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'size'> & {
  variant?: "default";
  size?: "sm" | "md";
};

/** Time left, with an urgent state that is not colour alone. */
export const Countdown = React.forwardRef<HTMLDivElement, CountdownProps>(function Countdown(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-countdown", className].filter(Boolean).join(' ');
  return React.createElement(
    "div",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Countdown.displayName = "Countdown";
