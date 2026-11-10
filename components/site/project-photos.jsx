"use client";

import { useState } from "react";
import Image from "next/image";
import PhotoLightbox from "@/components/site/photo-lightbox";

export default function ProjectPhotos({ project }) {
  const [open, setOpen] = useState(null);

  const images =
    project.images.length > 0
      ? project.images
      : [{ url: project.cover, alt: project.coverAlt, caption: "" }];

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        {images.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            onClick={() => setOpen(index)}
            aria-label={`Open photograph ${index + 1} of ${project.title}`}
            className={`group relative overflow-hidden bg-plaster-deep ${
              index % 3 === 0
                ? "aspect-[16/10] sm:col-span-2"
                : "aspect-[4/5]"
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt || project.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="photo object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
            <div className="grain" aria-hidden="true" />
            <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-4 bg-gradient-to-t from-ink/75 to-transparent px-4 pb-4 pt-10 text-[0.74rem] text-plaster opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span>{image.caption || image.alt}</span>
              <span className="num shrink-0 text-plaster/60">
                {String(index + 1).padStart(2, "0")}
              </span>
            </span>
          </button>
        ))}
      </div>

      {open !== null ? (
        <PhotoLightbox
          project={project}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </>
  );
}
