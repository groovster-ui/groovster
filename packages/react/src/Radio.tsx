import * as React from 'react';

export type RadioProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "card";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Radio option in a named group. Native radios; eras skin the disc. */
export const Radio = React.forwardRef<HTMLElement, RadioProps>(function Radio(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-radio', className].filter(Boolean).join(' ');
  return React.createElement(
    'input[type=radio]',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Radio.displayName = 'Radio';
