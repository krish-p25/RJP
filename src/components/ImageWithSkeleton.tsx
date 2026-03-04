import { useEffect, useState } from "react";
import { ImageWithSkeletonProps } from "../types";

export function ImageWithSkeleton({
  src,
  alt,
  imgClassName,
  wrapperClassName,
  skeletonClassName,
  loading = "lazy",
  visible = true,
  onLoad
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const preloader = new window.Image();

    const markLoaded = () => {
      if (!isCancelled) {
        setIsLoaded(true);
      }
    };

    setIsLoaded(false);
    preloader.src = src;

    if (preloader.complete && preloader.naturalWidth > 0) {
      setIsLoaded(true);
      return () => {
        isCancelled = true;
      };
    }

    preloader.onload = markLoaded;
    preloader.onerror = markLoaded;

    return () => {
      isCancelled = true;
      preloader.onload = null;
      preloader.onerror = null;
    };
  }, [src]);

  const shouldShowImage = isLoaded && visible;

  return (
    <div className={["relative", wrapperClassName ?? ""].join(" ")}>
      {!isLoaded && <div aria-hidden="true" className={["absolute inset-0 skeleton-shimmer", skeletonClassName ?? ""].join(" ")} />}
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={[imgClassName, "transition-opacity duration-300", shouldShowImage ? "opacity-100" : "opacity-0"].join(" ")}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        onError={() => {
          setIsLoaded(true);
        }}
      />
    </div>
  );
}
