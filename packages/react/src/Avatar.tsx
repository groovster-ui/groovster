import * as React from 'react';

export type AvatarProps = Omit<React.ComponentPropsWithoutRef<'span'>, 'size'> & {
  fallback?: React.ReactNode;
  presence?: "online" | "away" | "busy" | "offline";
  variant?: "circle" | "square";
  size?: "sm" | "md" | "lg";
};

/** User/image avatar with initials fallback. */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { className, variant, size, fallback, presence, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-avatar", className].filter(Boolean).join(' ');
  return React.createElement(
    'span',
    { ref, className: cls, ...dataProps, ...rest },
    fallback != null ? React.createElement('span', { className: "ew-avatar__fallback" }, fallback) : null,
    presence != null ? React.createElement('span', { className: 'ew-avatar__presence', 'data-presence': presence }) : null,
    children
  );
});
Avatar.displayName = "Avatar";
