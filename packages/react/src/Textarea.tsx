import * as React from 'react';

export type TextareaProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "outline" | "filled";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Multi-line text field with label. Native textarea. */
export const Textarea = React.forwardRef<HTMLElement, TextareaProps>(function Textarea(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-textarea', className].filter(Boolean).join(' ');
  return React.createElement(
    'textarea',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Textarea.displayName = 'Textarea';
