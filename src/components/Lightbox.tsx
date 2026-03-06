import { useEffect } from "react";
import { GalleryImage } from "../types";
import { ImageWithSkeleton } from "./ImageWithSkeleton";

type LightboxProps = {
  image: GalleryImage | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
};

export function Lightbox({ image, onClose, onNext, onPrevious, hasNext = false, hasPrevious = false }: LightboxProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight" && hasNext && onNext) {
        onNext();
      } else if (event.key === "ArrowLeft" && hasPrevious && onPrevious) {
        onPrevious();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onNext, onPrevious, hasNext, hasPrevious]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (image) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [image]);

  return (
    <div
      className={[
        "fixed inset-0 z-40 flex items-center justify-center bg-[rgba(6,9,8,0.86)] p-4 transition-opacity duration-200 max-[768px]:p-3",
        image ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      ].join(" ")}
      aria-hidden={image ? "false" : "true"}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <button
        className="absolute right-5 top-4 z-50 cursor-pointer border-0 bg-transparent text-5xl text-white transition-opacity duration-200 hover:opacity-70 max-[768px]:right-3 max-[768px]:top-3 max-[768px]:text-4xl"
        aria-label="Close image"
        onClick={onClose}
      >
        &times;
      </button>

      {/* Desktop: Arrows on sides of image */}
      {hasPrevious && (
        <button
          type="button"
          aria-label="Previous image"
          className="absolute left-4 top-1/2 z-50 hidden -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-[rgba(14,12,26,0.42)] text-white shadow-[0_12px_28px_rgba(0,0,0,0.28)] backdrop-blur-md transition-[transform,background-color,border-color,box-shadow] duration-200 hover:scale-[1.08] hover:border-white/75 hover:bg-[rgba(14,12,26,0.62)] hover:shadow-[0_16px_34px_rgba(0,0,0,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(14,12,26,0.55)] md:grid md:h-12 md:w-12"
          onClick={onPrevious}
        >
          <span aria-hidden="true" className="text-[1.6rem] leading-none">
            &#8249;
          </span>
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          aria-label="Next image"
          className="absolute right-4 top-1/2 z-50 hidden -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-[rgba(14,12,26,0.42)] text-white shadow-[0_12px_28px_rgba(0,0,0,0.28)] backdrop-blur-md transition-[transform,background-color,border-color,box-shadow] duration-200 hover:scale-[1.08] hover:border-white/75 hover:bg-[rgba(14,12,26,0.62)] hover:shadow-[0_16px_34px_rgba(0,0,0,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(14,12,26,0.55)] md:grid md:h-12 md:w-12"
          onClick={onNext}
        >
          <span aria-hidden="true" className="text-[1.6rem] leading-none">
            &#8250;
          </span>
        </button>
      )}

      {image && (
        <div
          className="flex w-full flex-col items-center"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <ImageWithSkeleton
              src={image.src}
              alt={image.caption}
              imgClassName="max-h-[78vh] max-w-[min(980px,95vw)] rounded-[14px] shadow-[0_24px_55px_rgba(0,0,0,0.5)] max-[768px]:max-h-[70vh] max-[768px]:max-w-[92vw]"
              loading="eager"
              skeletonClassName="rounded-[14px] bg-white/15"
            />
          </div>

          {/* Caption with mobile arrows */}
          <div
            className="mt-3 flex w-full max-w-[min(980px,95vw)] items-center justify-center gap-3 max-[768px]:mt-4 max-[768px]:gap-2 max-[768px]:px-1"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Mobile: Left arrow */}
            {hasPrevious && (
              <button
                type="button"
                aria-label="Previous image"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/45 bg-[rgba(14,12,26,0.42)] text-white shadow-[0_8px_20px_rgba(0,0,0,0.28)] backdrop-blur-md transition-[transform,background-color,border-color] duration-200 active:scale-95 md:hidden"
                onClick={onPrevious}
              >
                <span aria-hidden="true" className="text-[1.4rem] leading-none">
                  &#8249;
                </span>
              </button>
            )}

            <p className="flex-1 text-center text-[0.95rem] text-[#e7ece8] max-[768px]:text-[0.88rem]">
              {image.caption}
            </p>

            {/* Mobile: Right arrow */}
            {hasNext && (
              <button
                type="button"
                aria-label="Next image"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/45 bg-[rgba(14,12,26,0.42)] text-white shadow-[0_8px_20px_rgba(0,0,0,0.28)] backdrop-blur-md transition-[transform,background-color,border-color] duration-200 active:scale-95 md:hidden"
                onClick={onNext}
              >
                <span aria-hidden="true" className="text-[1.4rem] leading-none">
                  &#8250;
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
