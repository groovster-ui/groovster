import * as React from 'react';

export type AvatarProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "circle" | "square";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: User/image avatar with initials fallback. */
export const Avatar = React.forwardRef<HTMLElement, AvatarProps>(function Avatar(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-avatar', className].filter(Boolean).join(' ');
  return React.createElement(
    'span',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Avatar.displayName = 'Avatar';
