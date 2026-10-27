import { useEffect, useState } from "react";

import { FALLBACK_IMAGE } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Image with guaranteed rendering: shows a shimmer while loading and swaps to a
 * local illustration if the source ever fails. Never renders a broken icon.
 */
export function SmartImage({
  src,
  alt,
  className,
  wrapperClassName,
  eager = false,
  width = 1024,
  height = 640,
}: {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  eager?: boolean;
  width?: number;
  height?: number;
}) {
  const [current, setCurrent] = useState(src || FALLBACK_IMAGE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrent(src || FALLBACK_IMAGE);
    setLoaded(false);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-surface-2", wrapperClassName)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-primary/10 via-surface-2 to-accent/10" />
      )}
      <img
        src={current}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (current !== FALLBACK_IMAGE) setCurrent(FALLBACK_IMAGE);
          setLoaded(true);
        }}
        className={cn(
          "size-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </div>
  );
}
