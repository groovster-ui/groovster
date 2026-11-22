import * as React from 'react';

export type SliderProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'type'> & {
  label?: React.ReactNode;
  variant?: "default";
  size?: "sm" | "md" | "lg";
};

/** Native range input with era track/thumb chrome. */
export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { className, variant, size, label, children, id, value, defaultValue, ...rest },
  ref
) {
  const autoId = React.useId();
  const controlId = id ?? autoId;
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const rootExtra: Record<string, unknown> = {};
  const controlProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (key.startsWith('data-') || key === 'style') rootExtra[key] = value;
    else controlProps[key] = value;
  }
  const cls = ["ew-slider", className].filter(Boolean).join(' ');
  const shown = value ?? defaultValue ?? '';
  return React.createElement(
    'ew-slider',
    { className: cls, ...dataProps, ...(rootExtra as React.HTMLAttributes<HTMLElement>) },
    label != null ? React.createElement('label', { className: "ew-slider__label", htmlFor: controlId }, label) : null,
    React.createElement('input', {
      ...(controlProps as React.InputHTMLAttributes<HTMLInputElement>),
      ref,
      id: controlId,
      className: "ew-slider__control",
      type: 'range',
      ...(value !== undefined ? { value } : {}),
      ...(defaultValue !== undefined ? { defaultValue } : {}),
    }),
    React.createElement('output', { className: "ew-slider__value", htmlFor: controlId }, shown)
  );
});
Slider.displayName = "Slider";
