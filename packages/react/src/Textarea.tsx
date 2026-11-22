import * as React from 'react';

export type TextareaProps = Omit<React.ComponentPropsWithoutRef<'textarea'>, 'size'> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  variant?: "outline" | "filled";
  size?: "sm" | "md" | "lg";
};

/** Multi-line text field with label. Native textarea. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
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
  const cls = ["ew-textarea", className].filter(Boolean).join(' ');
  return React.createElement(
    'div',
    {
      className: cls,
      ...dataProps,
      ...(rootExtra as React.HTMLAttributes<HTMLDivElement>),
      ...(invalid ? { 'data-invalid': 'true' } : {}),
    },
    React.createElement('label', { className: "ew-textarea__label", htmlFor: controlId }, label ?? children),
    description ? React.createElement('div', { className: "ew-textarea__description", id: descriptionId }, description) : null,
    React.createElement('textarea', {
      ...(controlProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>),
      ref,
      id: controlId,
      className: "ew-textarea__control",
      required,
      'aria-invalid': invalid ? true : undefined,
      'aria-describedby': describedBy,
      rows: (rest.rows as number | undefined) ?? 4,
    }),
    null
  );
});
Textarea.displayName = "Textarea";
