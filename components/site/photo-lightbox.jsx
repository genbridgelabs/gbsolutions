"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

export default function PhotoLightbox({ project, index, onIndex, onClose }) {
  const images =
    project.images.length > 0
      ? project.images
      : [
          {
            url: project.cover,
            alt: project.coverAlt || project.title,
            caption: "",
          },
        ];

  const current = images[Math.min(index, images.length - 1)];
  const closeRef = useRef(null);
  const touchX = useRef(null);

  const step = useCallback(
    (delta) => {
      onIndex((index + delta + images.length) % images.length);
    },
    [index, images.length, onIndex]
  );

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — photographs`}
      className="anim-fade fixed inset-0 z-[90] flex flex-col bg-indigo-deep/97 text-plaster backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={(event) => {
        touchX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchX.current === null) return;
        const delta = (event.changedTouches[0]?.clientX ?? 0) - touchX.current;
        if (Math.abs(delta) > 48) step(delta < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-start justify-between gap-6 px-5 py-4 sm:px-8">
        <div className="min-w-0">
          <p className="text-[0.68rem] text-brass-light">
            {project.category} · {project.place}, {project.year}
          </p>
          <h3 className="mt-1.5 truncate font-display text-[1.5rem] leading-tight sm:text-[1.9rem]">
            {project.title}
          </h3>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close the gallery"
          className="flex size-11 shrink-0 items-center justify-center border border-plaster/30 text-plaster transition-colors duration-300 hover:border-brass-light hover:text-brass-light"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-16">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous photograph"
          className="absolute left-3 z-10 hidden size-11 items-center justify-center border border-plaster/25 text-plaster transition-colors duration-300 hover:border-brass-light hover:text-brass-light sm:flex"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} />
        </button>

        <div className="relative h-[46svh] w-full sm:h-[62svh]">
          <Image
            key={`${current.url}-${index}`}
            src={current.url}
            alt={current.alt || project.title}
            fill
            sizes="100vw"
            className="anim-soft-in object-contain"
            priority
          />
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next photograph"
          className="absolute right-3 z-10 hidden size-11 items-center justify-center border border-plaster/25 text-plaster transition-colors duration-300 hover:border-brass-light hover:text-brass-light sm:flex"
        >
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="px-5 pb-6 pt-4 sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line-light pt-4">
          <p className="text-[0.82rem] text-plaster/70">
            {current.caption || current.alt || project.summary}
          </p>
          <p className="num text-[0.72rem] text-plaster/45">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </p>
        </div>

        {images.length > 1 ? (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {images.map((image, thumbIndex) => (
              <button
                key={`${image.url}-${thumbIndex}`}
                type="button"
                onClick={() => onIndex(thumbIndex)}
                aria-label={`Photograph ${thumbIndex + 1}`}
                aria-current={thumbIndex === index}
                className={`relative h-12 w-20 shrink-0 overflow-hidden border transition-all duration-300 ${
                  thumbIndex === index
                    ? "border-brass-light opacity-100"
                    : "border-transparent opacity-45 hover:opacity-80"
                }`}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="photo object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
