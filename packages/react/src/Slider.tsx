import * as React from 'react';

export type SliderProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "default";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Native range input with era track/thumb chrome. */
export const Slider = React.forwardRef<HTMLElement, SliderProps>(function Slider(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-slider', className].filter(Boolean).join(' ');
  return React.createElement(
    'ew-slider',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Slider.displayName = 'Slider';
