import Image from "next/image";
import Link from "next/link";
import { navLinks, places, studio } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-indigo text-plaster">
      <div className="grain grain-light" aria-hidden="true" />

      <div className="relative mx-auto max-w-[90rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/mark-paper.png"
              alt=""
              width={140}
              height={70}
              className="h-16 w-auto opacity-95"
            />
            <p className="mt-6 max-w-[15ch] font-display text-[1.75rem] leading-[1.12] text-plaster">
              Rooms drawn for the way you live in them.
            </p>
          </div>

          <div className="text-[0.84rem] leading-relaxed text-plaster/70">
            <p className="mb-4 text-plaster/45">Studio</p>
            {studio.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <a
              href={studio.phoneHref}
              className="mt-5 block font-display text-[1.35rem] text-plaster transition-colors hover:text-brass-light"
            >
              {studio.phone}
            </a>
            <a
              href={`mailto:${studio.email}`}
              className="mt-1 block transition-colors hover:text-brass-light"
            >
              {studio.email}
            </a>
          </div>

          <div className="flex flex-col justify-between gap-8 text-[0.84rem]">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="w-fit text-plaster/70 transition-colors hover:text-plaster"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="text-plaster/55">
              <p>{studio.hours}</p>
              <Link
                href="/admin"
                className="mt-3 inline-block text-[0.74rem] text-plaster/45 underline decoration-plaster/25 underline-offset-4 transition-colors hover:text-brass-light hover:decoration-brass-light"
              >
                Studio access
              </Link>
            </div>
          </div>
        </div>

        <div className="marquee mt-14 border-y border-line-light py-4 sm:mt-20">
          <div className="marquee-track">
            {[...places, ...places].map((place, index) => (
              <span
                key={`${place}-${index}`}
                className="flex items-center gap-6 pr-6 font-display text-[1.1rem] text-plaster/60"
              >
                {place}
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-brass-light/70"
                />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-[0.72rem] text-plaster/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 GB Solutions, Bhubaneswar</p>
          <p>Photographs from completed projects. Drawings remain our own.</p>
        </div>
      </div>
    </footer>
  );
}
