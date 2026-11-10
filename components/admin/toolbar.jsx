"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, Search } from "lucide-react";
import { projectTypes } from "@/lib/content";

const STATUSES = [
  ["all", "All"],
  ["new", "New"],
  ["contacted", "Contacted"],
  ["quoted", "Quoted"],
  ["won", "Won"],
  ["lost", "Lost"],
];

export default function Toolbar({ q, status, type, exportHref, total }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [term, setTerm] = useState(q);

  function push(next) {
    const sp = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === "all") sp.delete(key);
      else sp.set(key, value);
    }
    sp.delete("page");
    const query = sp.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  useEffect(() => {
    if (term === q) return;
    const timer = setTimeout(() => push({ q: term }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, q]);

  return (
    <div className="flex flex-col gap-5 border-y border-line py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search
            className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-quiet"
            strokeWidth={1.5}
          />
          <input
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search name, phone, place, or what they wrote"
            aria-label="Search enquiries"
            className="h-10 w-full border-b border-line-strong bg-transparent pl-6 text-[0.86rem] text-ink outline-none transition-colors placeholder:text-quiet/60 focus:border-brass"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="type-filter" className="sr-only">
            Filter by project type
          </label>
          <select
            id="type-filter"
            value={type}
            onChange={(event) => push({ type: event.target.value })}
            className="h-10 border border-line-strong bg-paper px-2.5 text-[0.8rem] text-ink outline-none transition-colors focus:border-brass"
          >
            <option value="all">Every project type</option>
            {projectTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <a
            href={exportHref}
            className="inline-flex h-10 items-center gap-2 bg-indigo px-4 text-[0.8rem] font-medium text-plaster transition-colors hover:bg-ink"
          >
            <Download className="size-4" strokeWidth={1.6} />
            Download Excel
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
        {STATUSES.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => push({ status: value })}
            aria-pressed={status === value}
            className={`px-3 py-1.5 text-[0.78rem] transition-colors ${
              status === value
                ? "bg-ink text-plaster"
                : "text-quiet hover:bg-paper hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="num ml-auto text-[0.72rem] text-quiet">
          {total} {total === 1 ? "enquiry" : "enquiries"}
        </span>
      </div>
    </div>
  );
}
