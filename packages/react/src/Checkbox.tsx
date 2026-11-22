import * as React from 'react';

export type CheckboxProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'type'> & {
  label?: React.ReactNode;
  variant?: "default" | "card";
  size?: "sm" | "md" | "lg";
};

/** Labeled checkbox. Native input; eras skin the box. */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
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
  const cls = ["ew-checkbox", className].filter(Boolean).join(' ');
  return React.createElement(
    'label',
    { className: cls, ...dataProps, ...(rootExtra as React.LabelHTMLAttributes<HTMLLabelElement>) },
    React.createElement('input', {
      ...(controlProps as React.InputHTMLAttributes<HTMLInputElement>),
      ref, ...(checked !== undefined ? { checked } : {}), ...(defaultChecked !== undefined ? { defaultChecked } : {}), ...(onChange ? { onChange } : {}),
      className: "ew-checkbox__control",
      type: "checkbox",
    }),
    React.createElement('span', { className: "ew-checkbox__box", 'aria-hidden': true }),
    React.createElement('span', { className: "ew-checkbox__label" }, label ?? children)
  );
});
Checkbox.displayName = "Checkbox";
