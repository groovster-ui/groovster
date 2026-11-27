import * as React from 'react';

export type MediaCardProps = Omit<React.ComponentPropsWithoutRef<'a'>, 'size'> & {
  ratio?: "poster" | "wide";
  size?: "sm" | "md";
};

/** Poster or widescreen card with an overlay title and a watched bar. */
export const MediaCard = React.forwardRef<HTMLAnchorElement, MediaCardProps>(function MediaCard(
  { className, ratio, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (ratio != null) dataProps["data-ratio"] = ratio;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-media-card", className].filter(Boolean).join(' ');
  return React.createElement(
    "a",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
MediaCard.displayName = "MediaCard";
