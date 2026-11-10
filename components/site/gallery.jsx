"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/site/reveal";

// Asymmetric editorial rhythm: the grid never settles into equal cards.
const LAYOUT = [
  { span: "lg:col-span-7", ratio: "aspect-[16/11]", shift: "" },
  { span: "lg:col-span-5", ratio: "aspect-[4/5]", shift: "lg:mt-20" },
  { span: "lg:col-span-4", ratio: "aspect-[3/4]", shift: "" },
  { span: "lg:col-span-4", ratio: "aspect-[3/4]", shift: "lg:mt-14" },
  { span: "lg:col-span-4", ratio: "aspect-[3/4]", shift: "lg:mt-28" },
];

export default function Gallery({ items }) {
  const [active, setActive] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category)))],
    [items]
  );

  const shown = useMemo(
    () =>
      active === "All" ? items : items.filter((item) => item.category === active),
    [items, active]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-line pb-4">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            aria-pressed={active === category}
            className={`relative pb-0.5 text-[0.84rem] transition-colors duration-300 ${
              active === category ? "text-ink" : "text-quiet hover:text-ink"
            }`}
          >
            {category}
            <span
              aria-hidden="true"
              className={`absolute -bottom-[1.15rem] left-0 h-px bg-brass transition-[width] duration-500 ${
                active === category ? "w-full" : "w-0"
              }`}
            />
          </button>
        ))}
        <span className="num ml-auto text-[0.72rem] text-quiet">
          {shown.length} {shown.length === 1 ? "room" : "rooms"} shown
        </span>
      </div>

      <div
        key={active}
        className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-10"
      >
        {shown.map((item, index) => {
          const layout = LAYOUT[index % LAYOUT.length];
          return (
            <article
              key={item.id}
              className={`group ${layout.span} ${layout.shift}`}
            >
              <Reveal delay={(index % 5) * 80}>
                <Link href={`/work/${item.slug}`} className="block">
                  <div
                    className={`relative ${layout.ratio} overflow-hidden bg-plaster-deep`}
                  >
                    <Image
                      src={item.cover}
                      alt={item.coverAlt || item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 46vw"
                      className="photo object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />
                    <div className="grain" aria-hidden="true" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-ink/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <span className="absolute left-0 top-0 bg-plaster/92 px-3 py-2 text-[0.68rem] text-ink">
                      {item.typeLabel || item.category}
                    </span>

                    <span className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-between gap-4 text-[0.72rem] text-plaster opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="num">
                        {String(Math.max(1, item.images.length)).padStart(2, "0")}{" "}
                        photographs
                      </span>
                      <span className="inline-flex items-center gap-2">
                        View project
                        <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brass-light transition-transform duration-700 ease-out group-hover:scale-x-100"
                    />
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-5 border-t border-line pt-3.5">
                    <div>
                      <h3 className="font-display text-[1.4rem] leading-tight text-ink transition-colors duration-500 group-hover:text-brass">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 max-w-[36ch] text-[0.82rem] leading-relaxed text-quiet">
                        {item.summary}
                      </p>
                    </div>
                    <span className="num shrink-0 pt-1 text-[0.72rem] text-quiet">
                      {item.place}, {item.year}
                    </span>
                  </div>
                </Link>
              </Reveal>
            </article>
          );
        })}
      </div>

      <div className="mt-12 border-t border-line pt-6">
        <Link href="/work" className="link-rule text-[0.86rem] text-ink">
          The full archive, with 3D walkthroughs
          <ArrowUpRight className="size-4" strokeWidth={1.6} />
        </Link>
      </div>
    </div>
  );
}
