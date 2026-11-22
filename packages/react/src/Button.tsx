import * as React from 'react';

export type ButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'size'> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

/** Pressable control for primary actions. Zero attributes = medium primary button. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, children, type = 'button', ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-button", className].filter(Boolean).join(' ');
  return React.createElement(
    "button",
    { ref, ...rest, className: cls, type, ...dataProps },
    children
  );
});
Button.displayName = "Button";
