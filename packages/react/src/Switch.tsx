import * as React from 'react';

export type SwitchProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "success";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Binary on/off control. Prefer checkbox with switch role styling, or input type=checkbox with appearance skinning. */
export const Switch = React.forwardRef<HTMLElement, SwitchProps>(function Switch(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-switch', className].filter(Boolean).join(' ');
  return React.createElement(
    'input[type=checkbox]',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Switch.displayName = 'Switch';
