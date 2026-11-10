"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function MediaInput({
  label,
  value,
  onChange,
  kind = "image",
  hint,
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "That upload failed.");
      onChange(data.url);
      toast.success(kind === "video" ? "Video uploaded" : "Image uploaded");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  const isVideo = kind === "video";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-[0.72rem] text-quiet">{label}</label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1.5 text-[0.72rem] text-brass transition-colors hover:text-ink disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" strokeWidth={1.7} />
          ) : (
            <Upload className="size-3.5" strokeWidth={1.7} />
          )}
          {busy ? "Uploading" : isVideo ? "Upload video" : "Upload image"}
        </button>
      </div>

      <div className="mt-2 flex items-center gap-3">
        {value ? (
          <span className="relative h-12 w-16 shrink-0 overflow-hidden border border-line-strong bg-plaster-deep">
            {isVideo ? (
              <span className="flex h-full w-full items-center justify-center text-[0.6rem] text-quiet">
                video
              </span>
            ) : (
              <Image
                src={value}
                alt=""
                fill
                sizes="64px"
                unoptimized
                className="object-cover"
              />
            )}
          </span>
        ) : null}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={isVideo ? "/media/video/clip.mp4 or a video URL" : "/media/photo.jpg or an image URL"}
          className="h-10 min-w-0 flex-1 border border-line-strong bg-paper px-2.5 text-[0.8rem] text-ink outline-none transition-colors placeholder:text-quiet/55 focus:border-brass"
        />
      </div>

      {hint ? (
        <p className="mt-1.5 text-[0.7rem] leading-relaxed text-quiet/80">{hint}</p>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={isVideo ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp,image/avif"}
        onChange={upload}
        className="sr-only"
        tabIndex={-1}
      />
    </div>
  );
}
