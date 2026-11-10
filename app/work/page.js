import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/site/site-header";
import SiteFooter from "@/components/site/site-footer";
import Reveal from "@/components/site/reveal";
import { listGallery } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work",
  description:
    "Every finished GB Solutions project — homes, workspaces and hospitality across Bhubaneswar, Cuttack and Puri. Open one for photographs, the story and a 3D walkthrough.",
};

export default async function WorkPage() {
  const items = await listGallery();

  return (
    <>
      <SiteHeader />

      <main className="pt-28 sm:pt-32">
        <section className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <header className="grid gap-8 border-b border-line pb-10 md:grid-cols-[1.05fr_0.95fr] md:items-end">
            <div>
              <p className="label">The archive</p>
              <h1 className="display-hero mt-5 max-w-[13ch] text-ink">
                Every room we have finished.
              </h1>
            </div>
            <p className="max-w-[44ch] text-[0.95rem] leading-[1.75] text-ink-soft md:justify-self-end">
              {items.length} projects across Bhubaneswar, Cuttack and Puri. Open
              one for the photographs and the story behind it, then walk through
              the room in 3D.
            </p>
          </header>

          <ol>
            {items.map((item, index) => (
              <Reveal
                as="li"
                key={item.id}
                delay={index * 60}
                className="border-b border-line"
              >
                <Link
                  href={`/work/${item.slug}`}
                  className="group grid gap-6 py-9 md:grid-cols-[0.95fr_1.05fr] md:items-center md:gap-12 md:py-12"
                >
                  <div className="relative aspect-[16/11] overflow-hidden bg-plaster-deep md:order-2">
                    <Image
                      src={item.cover}
                      alt={item.coverAlt || item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 48vw"
                      className="photo object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <div className="grain" aria-hidden="true" />
                    <span className="absolute right-0 top-0 bg-plaster/92 px-3 py-2 text-[0.66rem] text-ink">
                      3D walkthrough
                    </span>
                  </div>

                  <div className="md:order-1">
                    <p className="num text-[0.7rem] text-brass">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="display-md mt-3 max-w-[18ch] text-ink transition-colors duration-500 group-hover:text-brass">
                      {item.title}
                    </h2>
                    <p className="mt-3 max-w-[42ch] text-[0.9rem] leading-[1.75] text-quiet">
                      {item.summary}
                    </p>
                    <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.74rem] text-quiet">
                      <span>{item.place}</span>
                      <span aria-hidden="true" className="text-line-strong">
                        /
                      </span>
                      <span className="num">{item.year}</span>
                      <span aria-hidden="true" className="text-line-strong">
                        /
                      </span>
                      <span>{item.images.length} photographs</span>
                    </p>
                    <span className="link-rule mt-6 inline-flex items-center gap-2 text-[0.84rem] text-ink">
                      View the project
                      <ArrowUpRight className="size-4" strokeWidth={1.6} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ol>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
