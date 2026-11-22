import * as React from 'react';

export type RadioProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'type'> & {
  label?: React.ReactNode;
  variant?: "default" | "card";
  size?: "sm" | "md" | "lg";
};

/** Radio option in a named group. Native radios; eras skin the disc. */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, variant, size, label, children, checked, defaultChecked, onChange, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const rootExtra: Record<string, unknown> = {};
  const controlProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (key.startsWith('data-') || key === 'style') rootExtra[key] = value;
    else controlProps[key] = value;
  }
  const cls = ["ew-radio", className].filter(Boolean).join(' ');
  return React.createElement(
    'label',
    { className: cls, ...dataProps, ...(rootExtra as React.LabelHTMLAttributes<HTMLLabelElement>) },
    React.createElement('input', {
      ...(controlProps as React.InputHTMLAttributes<HTMLInputElement>),
      ref, ...(checked !== undefined ? { checked } : {}), ...(defaultChecked !== undefined ? { defaultChecked } : {}), ...(onChange ? { onChange } : {}),
      className: "ew-radio__control",
      type: "radio",
    }),
    React.createElement('span', { className: "ew-radio__disc", 'aria-hidden': true }),
    React.createElement('span', { className: "ew-radio__label" }, label ?? children)
  );
});
Radio.displayName = "Radio";
