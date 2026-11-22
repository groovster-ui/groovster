import * as React from 'react';

export type TextFieldProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "outline" | "filled" | "underline";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Labeled single-line text input. Native <input>; eras skin the chrome only. */
export const TextField = React.forwardRef<HTMLElement, TextFieldProps>(function TextField(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-text-field', className].filter(Boolean).join(' ');
  return React.createElement(
    'input',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
TextField.displayName = 'TextField';
