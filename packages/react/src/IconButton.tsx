import * as React from 'react';

export type IconButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'size'> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

/** Icon-only button with required accessible name. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, variant, size, children, type, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-icon-button", className].filter(Boolean).join(' ');
  const label = typeof rest['aria-label'] === 'string' ? rest['aria-label'] : undefined;
  return React.createElement(
    'button',
    { ref, type: type ?? 'button', className: cls, ...dataProps, ...rest },
    React.createElement('span', {
      className: "ew-icon-button__icon",
      ...(label ? { 'aria-hidden': true } : {}),
    }, children)
  );
});
IconButton.displayName = "IconButton";
