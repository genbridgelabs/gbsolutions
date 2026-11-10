import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Box } from "lucide-react";
import SiteHeader from "@/components/site/site-header";
import SiteFooter from "@/components/site/site-footer";
import ProjectPhotos from "@/components/site/project-photos";
import Reveal from "@/components/site/reveal";
import { getGalleryItem, listGallery } from "@/lib/gallery";
import { breadcrumbSchema, jsonLd, projectSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getGalleryItem(slug);
  if (!project) {
    return { title: "Project not found", robots: { index: false, follow: true } };
  }
  const title = `${project.title} — ${project.place} ${project.category.toLowerCase()}`;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title,
      description: project.summary,
      url: `/work/${project.slug}`,
      siteName: "GB Solutions",
      locale: "en_IN",
      type: "article",
      images: [
        {
          url: project.cover,
          width: 2000,
          height: 1500,
          alt: project.coverAlt || project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.summary,
      images: [project.cover],
    },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getGalleryItem(slug);
  if (!project) notFound();

  const all = await listGallery();
  const index = all.findIndex((item) => item.id === project.id);
  const next = index >= 0 && all.length > 1 ? all[(index + 1) % all.length] : null;

  const paragraphs = (project.description || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <SiteHeader />

      <main className="pt-24 sm:pt-28">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-[0.76rem] text-quiet transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.6} />
            All work
          </Link>

          <header className="mt-8 grid gap-8 border-b border-line pb-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <p className="label">
                {project.typeLabel || project.category}
              </p>
              <h1 className="display-hero mt-5 max-w-[16ch] text-ink">
                {project.title}
              </h1>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-[0.84rem] lg:justify-self-end">
              <div>
                <dt className="text-[0.7rem] text-quiet">Where</dt>
                <dd className="mt-1 text-ink">{project.place}</dd>
              </div>
              <div>
                <dt className="text-[0.7rem] text-quiet">Finished</dt>
                <dd className="num mt-1 text-ink">{project.year}</dd>
              </div>
              <div>
                <dt className="text-[0.7rem] text-quiet">Type</dt>
                <dd className="mt-1 text-ink">{project.category}</dd>
              </div>
              <div>
                <dt className="text-[0.7rem] text-quiet">Photographs</dt>
                <dd className="num mt-1 text-ink">{project.images.length}</dd>
              </div>
            </dl>
          </header>

          <figure className="anim-clip relative mt-8 aspect-[16/10] overflow-hidden bg-plaster-deep">
            <Image
              src={project.cover}
              alt={project.coverAlt || project.title}
              fill
              priority
              sizes="100vw"
              className="photo object-cover"
            />
            <div className="grain" aria-hidden="true" />
            {project.coverAlt ? (
              <figcaption className="absolute bottom-4 left-4 bg-plaster/90 px-3 py-2 text-[0.68rem] text-ink">
                {project.coverAlt}
              </figcaption>
            ) : null}
          </figure>

          <div className="mt-12 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="label">The project</p>
              <p className="mt-6 max-w-[24ch] text-[0.82rem] leading-relaxed text-quiet">
                {project.summary}
              </p>
              <Link
                href={`/work/${project.slug}/room`}
                className="link-rule mt-8 inline-flex items-center gap-2 text-[0.82rem] text-ink"
              >
                <Box className="size-4" strokeWidth={1.5} />
                Open the 3D room
              </Link>
            </div>

            <div>
              <Reveal>
                <p className="lede max-w-[54ch] text-[1.12rem] leading-[1.7] text-ink">
                  {project.summary}
                </p>
              </Reveal>
              <Reveal delay={90} className="mt-6 space-y-4">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 24)}
                      className="max-w-[62ch] text-[0.95rem] leading-[1.8] text-ink-soft"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="max-w-[62ch] text-[0.95rem] leading-[1.8] text-ink-soft">
                    Photographs from the finished project. The full write-up is
                    being prepared — call the studio if you would like to hear
                    how this one was built.
                  </p>
                )}
              </Reveal>
            </div>
          </div>

          <section className="relative mt-16 overflow-hidden bg-indigo text-plaster">
            <div className="grain grain-light" aria-hidden="true" />
            <div className="relative grid gap-8 px-6 py-9 sm:px-9 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
              <div>
                <p className="label !text-brass-light">3D walkthrough</p>
                <h2 className="display-md mt-3 max-w-[24ch] text-plaster">
                  Step into the room.
                </h2>
                <p className="mt-3 max-w-[52ch] text-[0.86rem] leading-[1.7] text-plaster/55">
                  A room built in WebGL from this project&apos;s photographs.
                  Drag to look around, walk with W A S D or the arrow keys, and
                  the captions follow whichever print you face.
                </p>
              </div>
              <Link
                href={`/work/${project.slug}/room`}
                className="group inline-flex items-center justify-between gap-8 border border-plaster/35 px-6 py-4 text-[0.82rem] text-plaster transition-colors duration-300 hover:border-brass-light hover:text-brass-light"
              >
                Enter the room
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </section>

          <section className="mt-16">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="label">Photographs</p>
              <p className="num text-[0.72rem] text-quiet">
                {project.images.length} in this set
              </p>
            </div>
            <div className="mt-6">
              <ProjectPhotos project={project} />
            </div>
          </section>

          {next ? (
            <Link
              href={`/work/${next.slug}`}
              className="group mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-[0.7rem] text-quiet">Next project</p>
                <p className="mt-2 font-display text-[2rem] leading-tight text-ink transition-colors duration-500 group-hover:text-brass">
                  {next.title}
                </p>
                <p className="mt-1 text-[0.8rem] text-quiet">
                  {next.place}, {next.year}
                </p>
              </div>
              <span className="relative h-24 w-36 shrink-0 overflow-hidden bg-plaster-deep">
                <Image
                  src={next.cover}
                  alt=""
                  fill
                  sizes="144px"
                  className="photo object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </span>
            </Link>
          ) : null}
        </div>
      </main>

      <div className="mt-20">
        <SiteFooter />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            projectSchema(project),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Work", path: "/work" },
              { name: project.title, path: `/work/${project.slug}` },
            ]),
          ]),
        }}
      />
    </>
  );
}
