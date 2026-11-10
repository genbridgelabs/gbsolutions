"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import Reveal from "@/components/site/reveal";

function clock(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export default function VideoJournal({ videos }) {
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  if (!videos.length) return null;
  const entry = videos[Math.min(active, videos.length - 1)];
  const isFile = entry.source === "file";

  function select(index) {
    if (index === active) return;
    setActive(index);
    setStarted(false);
    setPlaying(false);
    setTime(0);
    setDuration(0);
  }

  async function toggle() {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) {
      setStarted(true);
      try {
        await element.play();
      } catch {
        setPlaying(false);
      }
    } else {
      element.pause();
    }
  }

  function seek(event) {
    const element = videoRef.current;
    if (!element || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    element.currentTime = ratio * duration;
    setTime(ratio * duration);
  }

  const percent = duration ? Math.min(100, (time / duration) * 100) : 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.62fr_1fr] lg:gap-14">
      <div>
        <div className="relative aspect-video overflow-hidden bg-indigo-deep">
          {isFile ? (
            <>
              <video
                key={entry.id}
                ref={videoRef}
                src={entry.src}
                poster={entry.poster}
                playsInline
                muted={muted}
                preload="metadata"
                className="h-full w-full object-cover"
                onPlay={() => {
                  setPlaying(true);
                  setStarted(true);
                }}
                onPause={() => setPlaying(false)}
                onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
                onLoadedMetadata={(event) =>
                  setDuration(event.currentTarget.duration || 0)
                }
                onEnded={() => {
                  setPlaying(false);
                  setStarted(false);
                  setTime(0);
                }}
              />

              {!started ? (
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={`Play ${entry.title}`}
                  className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-indigo-deep/75 via-indigo-deep/15 to-indigo-deep/35"
                >
                  <span className="flex size-16 items-center justify-center rounded-full border border-plaster/40 bg-indigo-deep/40 text-plaster backdrop-blur-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-brass-light group-hover:text-brass-light">
                    <Play className="size-5 translate-x-px" strokeWidth={1.4} />
                  </span>
                  <span className="absolute bottom-5 left-5 text-[0.7rem] text-plaster/75">
                    Press play · {entry.duration || "journal film"}
                  </span>
                </button>
              ) : null}
            </>
          ) : started ? (
            <iframe
              src={entry.embed}
              title={entry.title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setStarted(true)}
              aria-label={`Play ${entry.title}`}
              className="group absolute inset-0"
            >
              <Image
                src={entry.poster}
                alt={entry.posterAlt || entry.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="photo object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-indigo-deep/75 via-indigo-deep/10 to-indigo-deep/25" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-16 items-center justify-center rounded-full border border-plaster/40 bg-indigo-deep/40 text-plaster backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-brass-light group-hover:text-brass-light">
                  <Play className="size-5 translate-x-px" strokeWidth={1.4} />
                </span>
              </span>
            </button>
          )}

          <div className="grain grain-light" aria-hidden="true" />
        </div>

        {isFile ? (
          <div className="flex items-center gap-3 border-b border-line-light px-1 py-3 text-plaster/75">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause the film" : "Play the film"}
              className="flex size-8 items-center justify-center border border-plaster/25 text-plaster transition-colors hover:border-brass-light hover:text-brass-light"
            >
              {playing ? (
                <Pause className="size-3.5" strokeWidth={1.6} />
              ) : (
                <Play className="size-3.5 translate-x-px" strokeWidth={1.6} />
              )}
            </button>

            <button
              type="button"
              onClick={seek}
              aria-label="Seek through the film"
              className="group relative h-6 flex-1 cursor-pointer"
            >
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-plaster/20" />
              <span
                className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-brass-light transition-[width] duration-150"
                style={{ width: `${percent}%` }}
              />
              <span
                className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-brass-light opacity-0 transition-opacity group-hover:opacity-100"
                style={{ left: `calc(${percent}% - 3px)` }}
              />
            </button>

            <span className="num shrink-0 text-[0.68rem] text-plaster/50">
              {clock(time)} / {duration ? clock(duration) : entry.duration || "—"}
            </span>

            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex size-8 items-center justify-center border border-plaster/25 text-plaster transition-colors hover:border-brass-light hover:text-brass-light"
            >
              {muted ? (
                <VolumeX className="size-3.5" strokeWidth={1.6} />
              ) : (
                <Volume2 className="size-3.5" strokeWidth={1.6} />
              )}
            </button>

            <button
              type="button"
              onClick={() => videoRef.current?.requestFullscreen?.()}
              aria-label="Full screen"
              className="hidden size-8 items-center justify-center border border-plaster/25 text-plaster transition-colors hover:border-brass-light hover:text-brass-light sm:flex"
            >
              <Maximize2 className="size-3.5" strokeWidth={1.6} />
            </button>
          </div>
        ) : null}

        <Reveal className="mt-5">
          <p className="text-[0.7rem] text-brass-light">
            Chapter {String(active + 1).padStart(2, "0")}
            {entry.place ? ` · ${entry.place}` : ""}
            {entry.recordedOn ? ` · ${entry.recordedOn}` : ""}
          </p>
          <h3 className="mt-2 max-w-[26ch] font-display text-[1.6rem] leading-tight text-plaster sm:text-[2rem]">
            {entry.title}
          </h3>
          <p className="mt-3 max-w-[52ch] text-[0.88rem] leading-[1.75] text-plaster/55">
            {entry.description || entry.note}
          </p>
        </Reveal>
      </div>

      <div>
        <p className="text-[0.7rem] text-plaster/40">
          {videos.length} films, newest first
        </p>
        <ol className="mt-3 border-t border-line-light">
          {videos.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => select(index)}
                aria-current={index === active}
                className={`group flex w-full items-center gap-4 border-b border-line-light py-4 text-left transition-opacity duration-300 ${
                  index === active ? "opacity-100" : "opacity-65 hover:opacity-100"
                }`}
              >
                <span
                  className={`num text-[0.66rem] ${
                    index === active ? "text-brass-light" : "text-plaster/35"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="relative aspect-video w-24 shrink-0 overflow-hidden bg-indigo-deep">
                  <Image
                    src={item.poster}
                    alt=""
                    fill
                    sizes="96px"
                    className="photo object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {index === active ? (
                    <span className="absolute inset-0 border border-brass-light/70" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[1.05rem] leading-snug text-plaster">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[0.7rem] text-plaster/45">
                    {item.place}
                  </span>
                </span>
                <span className="num shrink-0 text-[0.68rem] text-plaster/40">
                  {item.duration}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
