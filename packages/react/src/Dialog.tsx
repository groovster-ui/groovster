import * as React from 'react';

export type DialogProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "modal" | "sheet";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Modal dialog using native <dialog>. Open with showModal(); eras skin backdrop and frame. */
export const Dialog = React.forwardRef<HTMLElement, DialogProps>(function Dialog(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-dialog', className].filter(Boolean).join(' ');
  return React.createElement(
    'dialog',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Dialog.displayName = 'Dialog';
