import { useEffect } from "react";
import { GalleryImage } from "../types";
import { ImageWithSkeleton } from "./ImageWithSkeleton";

type LightboxProps = {
  image: GalleryImage | null;
  onClose: () => void;
};

export function Lightbox({ image, onClose }: LightboxProps) {
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose]);

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
        "fixed inset-0 z-40 grid place-items-center bg-[rgba(6,9,8,0.86)] p-4 transition-opacity duration-200",
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
        className="absolute right-5 top-4 cursor-pointer border-0 bg-transparent text-5xl text-white"
        aria-label="Close image"
        onClick={onClose}
      >
        &times;
      </button>
      {image && (
        <>
          <ImageWithSkeleton
            src={image.src}
            alt={image.caption}
            imgClassName="max-h-[78vh] max-w-[min(980px,95vw)] rounded-[14px] shadow-[0_24px_55px_rgba(0,0,0,0.5)]"
            loading="eager"
            skeletonClassName="rounded-[14px] bg-white/15"
          />
          <p className="mt-2 text-center text-[#e7ece8]">{image.caption}</p>
        </>
      )}
    </div>
  );
}
