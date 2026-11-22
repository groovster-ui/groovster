import * as React from 'react';

export type TextFieldProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  variant?: "outline" | "filled" | "underline";
  size?: "sm" | "md" | "lg";
};

/** Labeled single-line text input. Native <input>; eras skin the chrome only. */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { className, variant, size, label, description, error, children, id, required, ...rest },
  ref
) {
  const autoId = React.useId();
  const controlId = id ?? autoId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [descriptionId, errorId, rest['aria-describedby']].filter(Boolean).join(' ') || undefined;
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const rootExtra: Record<string, unknown> = {};
  const controlProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (key.startsWith('data-') || key === 'style') rootExtra[key] = value;
    else controlProps[key] = value;
  }
  const invalid = error != null && error !== false && error !== '';
  const cls = ["ew-text-field", className].filter(Boolean).join(' ');
  return React.createElement(
    'div',
    {
      className: cls,
      ...dataProps,
      ...(rootExtra as React.HTMLAttributes<HTMLDivElement>),
      ...(invalid ? { 'data-invalid': 'true' } : {}),
    },
    React.createElement('label', { className: "ew-text-field__label", htmlFor: controlId }, label ?? children),
    description ? React.createElement('div', { className: "ew-text-field__description", id: descriptionId }, description) : null,
    React.createElement('input', {
      ...(controlProps as React.InputHTMLAttributes<HTMLInputElement>),
      ref,
      id: controlId,
      className: "ew-text-field__control",
      required,
      'aria-invalid': invalid ? true : undefined,
      'aria-describedby': describedBy,
      type: (rest.type as string | undefined) ?? 'text',
    }),
    error ? React.createElement('div', { className: "ew-text-field__error", id: errorId }, error) : null
  );
});
TextField.displayName = "TextField";
