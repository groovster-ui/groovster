import * as React from 'react';

export type DialogProps = Omit<React.ComponentPropsWithoutRef<'dialog'>, 'size' | 'title'> & {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "modal" | "sheet";
  size?: "sm" | "md" | "lg";
};

/** Modal dialog using native <dialog>. Open with showModal(); eras skin backdrop and frame. */
export const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  { className, variant, size, title, footer, children, ...rest },
  ref
) {
  const titleId = React.useId();
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-dialog", className].filter(Boolean).join(' ');
  return React.createElement(
    'dialog',
    {
      ref,
      className: cls,
      ...dataProps,
      ...(title != null ? { 'aria-labelledby': titleId } : {}),
      ...rest,
    },
    title != null
      ? React.createElement('header', { className: "ew-dialog__header" }, React.createElement('h2', { id: titleId }, title))
      : null,
    React.createElement('div', { className: "ew-dialog__body" }, children),
    footer != null ? React.createElement('footer', { className: "ew-dialog__footer" }, footer) : null
  );
});
Dialog.displayName = "Dialog";
