import * as React from 'react';

export type ButtonProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Pressable control for primary actions. Zero attributes = medium primary button. */
export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-button', className].filter(Boolean).join(' ');
  return React.createElement(
    'button',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Button.displayName = 'Button';
