"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navLinks, studio } from "@/lib/content";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open
            ? "border-line bg-plaster/88 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between gap-6 px-5 sm:h-20 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="GB Solutions, home"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/brand/mark-ink.png"
              alt=""
              width={76}
              height={38}
              priority
              className="h-7 w-auto sm:h-8"
            />
            <span className="flex flex-col justify-center leading-none">
              <span className="font-display text-[1.12rem] tracking-[-0.01em] text-ink sm:text-[1.22rem]">
                GB Solutions
              </span>
              <span className="mt-[0.28rem] text-[0.62rem] text-quiet sm:text-[0.66rem]">
                Interiors and turnkey build
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-[0.82rem] text-ink-soft lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 transition-colors duration-300 hover:text-brass"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden items-center gap-2 bg-indigo px-5 py-3 text-[0.78rem] font-medium text-plaster transition-colors duration-300 hover:bg-ink sm:inline-flex"
            >
              Start a project
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="studio-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center border border-line-strong lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 block h-px w-5 bg-ink transition-transform duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-5 bg-ink transition-transform duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="studio-menu"
          className="fixed inset-0 z-40 flex flex-col bg-plaster px-5 pt-24 pb-8 lg:hidden"
        >
          <nav className="flex flex-col">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="anim-rise flex items-baseline justify-between border-t border-line py-4 font-display text-[2rem] leading-none text-ink"
                style={{ animationDelay: `${60 + index * 55}ms` }}
              >
                {link.label}
                <span className="num text-[0.7rem] text-quiet">
                  0{index + 1}
                </span>
              </a>
            ))}
          </nav>

          <div className="anim-rise mt-auto border-t border-line pt-6 text-[0.82rem] text-ink-soft">
            <p className="font-display text-xl text-ink">{studio.phone}</p>
            <p className="mt-1">{studio.email}</p>
            <p className="mt-4 max-w-[26ch] text-quiet">
              {studio.addressLines.join(", ")}
            </p>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex w-full items-center justify-center bg-indigo px-5 py-4 text-[0.8rem] font-medium text-plaster"
            >
              Start a project
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
