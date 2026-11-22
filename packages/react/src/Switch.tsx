import * as React from 'react';

export type SwitchProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'type'> & {
  label?: React.ReactNode;
  variant?: "default" | "success";
  size?: "sm" | "md" | "lg";
};

/** Binary on/off control. Prefer checkbox with switch role styling, or input type=checkbox with appearance skinning. */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
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
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  const [ariaOn, setAriaOn] = React.useState(checked !== undefined ? !!checked : !!defaultChecked);
  React.useLayoutEffect(() => {
    if (checked !== undefined) setAriaOn(!!checked);
  }, [checked]);
  React.useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return undefined;
    const onReset = () => {
      queueMicrotask(() => {
        if (inputRef.current) setAriaOn(inputRef.current.checked);
      });
    };
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, []);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAriaOn(event.currentTarget.checked);
    onChange?.(event);
  };
  const cls = ["ew-switch", className].filter(Boolean).join(' ');
  return React.createElement(
    'label',
    { className: cls, ...dataProps, ...(rootExtra as React.LabelHTMLAttributes<HTMLLabelElement>) },
    React.createElement('input', {
      ...(controlProps as React.InputHTMLAttributes<HTMLInputElement>),
      ref: inputRef, role: 'switch', 'aria-checked': ariaOn ? 'true' : 'false', onChange: handleChange, ...(checked !== undefined ? { checked } : {}), ...(checked === undefined && defaultChecked !== undefined ? { defaultChecked } : {}),
      className: "ew-switch__control",
      type: "checkbox",
    }),
    React.createElement('span', { className: "ew-switch__track", 'aria-hidden': true }, React.createElement('span', { className: "ew-switch__thumb" })),
    React.createElement('span', { className: "ew-switch__label" }, label ?? children)
  );
});
Switch.displayName = "Switch";
