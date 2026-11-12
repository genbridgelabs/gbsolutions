import Image from "next/image";
import SiteHeader from "@/components/site/site-header";
import SiteFooter from "@/components/site/site-footer";
import Reveal from "@/components/site/reveal";
import Gallery from "@/components/site/gallery";
import VideoJournal from "@/components/site/video-journal";
import ContactForm from "@/components/site/contact-form";
import CostEstimator from "@/components/site/cost-estimator";
import { faqs, materials, processSteps, studio } from "@/lib/content";
import { listGallery } from "@/lib/gallery";
import { listVideos } from "@/lib/videos";
import { faqSchema, jsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: "/" },
};

const ledger = [
  { value: "120", label: "homes handed over" },
  { value: "15", label: "years in Odisha" },
  { value: "1", label: "team, start to finish" },
];

export default async function Home() {
  const [gallery, videos] = await Promise.all([listGallery(), listVideos()]);

  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero: asymmetric split, photograph clipped open on load. */}
        <section className="relative">
          <div className="mx-auto max-w-[90rem]">
            <div className="grid lg:min-h-[clamp(40rem,84svh,56rem)] lg:grid-cols-[1.02fr_0.98fr]">
              <div className="relative z-10 flex flex-col justify-center px-5 pt-32 pb-12 sm:px-8 sm:pt-36 lg:px-12 lg:py-24">
                <p
                  className="label anim-rise"
                  style={{ animationDelay: "80ms" }}
                >
                  Interior architecture and turnkey build, Bhubaneswar
                </p>

                <h1
                  className="display-hero anim-rise mt-6 max-w-[12ch] text-ink"
                  style={{ animationDelay: "180ms" }}
                >
                  Built for the weather, the street, and the people inside.
                </h1>

                <p
                  className="lede anim-rise mt-7 max-w-[45ch]"
                  style={{ animationDelay: "280ms" }}
                >
                  We plan rooms around Odisha&apos;s light and monsoon, source
                  from makers we know by name, and stay on site until the last
                  hinge is hung.
                </p>

                <div
                  className="anim-rise mt-9 flex flex-wrap items-center gap-x-8 gap-y-5"
                  style={{ animationDelay: "360ms" }}
                >
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-4 bg-indigo px-6 py-4 text-[0.82rem] font-medium text-plaster transition-colors duration-300 hover:bg-ink"
                  >
                    Start a project
                    <span className="h-px w-6 bg-plaster/45 transition-all duration-300 group-hover:w-9 group-hover:bg-brass-light" />
                  </a>
                  <a href="#work" className="link-rule text-[0.86rem] text-ink">
                    See recent work
                  </a>
                </div>

                <dl
                  className="anim-rise mt-12 grid max-w-lg grid-cols-3 gap-5 border-t border-line pt-6 sm:mt-16"
                  style={{ animationDelay: "440ms" }}
                >
                  {ledger.map((item) => (
                    <div key={item.label}>
                      <dt className="num font-display text-[1.7rem] leading-none text-ink">
                        {item.value}
                      </dt>
                      <dd className="mt-2 max-w-[12ch] text-[0.72rem] leading-snug text-quiet">
                        {item.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <figure className="relative min-h-[62svh] lg:min-h-0">
                <div className="anim-clip absolute inset-0 overflow-hidden bg-plaster-deep">
                  <Image
                    src="/media/detail-living.jpg"
                    alt="Living room in warm plaster and oak, lit by a tall window"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="photo anim-pan object-cover"
                  />
                  <div className="grain" aria-hidden="true" />
                </div>
                <figcaption className="absolute bottom-5 right-5 z-10 bg-plaster/90 px-3 py-2 text-[0.68rem] text-ink">
                  Patia residence, 2025
                </figcaption>
                <div className="absolute bottom-5 left-5 z-10 hidden lg:block">
                  <span className="num text-[0.68rem] text-paper/70">
                    20.29° N, 85.82° E
                  </span>
                </div>
              </figure>
            </div>
          </div>
        </section>

        {/* Studio */}
        <section id="studio" className="border-t border-line">
          <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="label">The practice</p>
                <p className="mt-6 text-[0.82rem] leading-relaxed text-quiet">
                  Bhubaneswar, Odisha
                  <br />
                  Working here since {studio.since}
                </p>
                <div
                  aria-hidden="true"
                  className="mt-10 hidden h-28 w-px bg-line lg:block"
                />
              </div>

              <div>
                <Reveal>
                  <h2 className="display-lg max-w-[19ch] text-ink">
                    Small on purpose. Answerable end to end.
                  </h2>
                </Reveal>

                <div className="mt-9 grid gap-8 md:grid-cols-2 md:gap-12">
                  <Reveal delay={90}>
                    <p className="max-w-[46ch] text-[0.95rem] leading-[1.78] text-ink-soft">
                      GB Solutions started in 2023 with two people, a borrowed
                      drafting table and a stubborn belief that interior work in
                      Odisha deserved better drawings. Fifteen years later we are
                      still small on purpose: one studio, one site team, one
                      person answerable for your project from the first
                      measurement to the last coat of lime.
                    </p>
                  </Reveal>
                  <Reveal delay={170}>
                    <p className="max-w-[46ch] text-[0.95rem] leading-[1.78] text-ink-soft">
                      We work in laterite, lime plaster, teak and brass because
                      those materials age well in this climate — and because the
                      people who work them live within a morning&apos;s drive.
                      Nothing here is imported for the sake of the brochure.
                    </p>
                  </Reveal>
                </div>

                <Reveal
                  delay={80}
                  className="mt-14 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-start"
                >
                  <figure>
                    <div className="relative aspect-[5/4] overflow-hidden bg-plaster-deep">
                      <Image
                        src="/media/studio.jpg"
                        alt="Studio table with material samples and drawings"
                        fill
                        sizes="(max-width: 768px) 100vw, 44vw"
                        className="photo object-cover"
                      />
                      <div className="grain" aria-hidden="true" />
                    </div>
                    <figcaption className="caption mt-3">
                      Sample day at the studio. Marble, lime, teak, brass.
                    </figcaption>
                  </figure>

                  <ul className="border-t border-line">
                    {materials.map((material) => (
                      <li
                        key={material.name}
                        className="group border-b border-line py-4 transition-colors duration-500 hover:bg-paper/70"
                      >
                        <p className="font-display text-[1.18rem] leading-snug text-ink">
                          {material.name}
                        </p>
                        <p className="mt-1.5 text-[0.82rem] leading-relaxed text-quiet">
                          {material.note}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="border-t border-line bg-paper/40">
          <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
              <Reveal>
                <p className="label">Work</p>
                <h2 className="display-lg mt-5 max-w-[16ch] text-ink">
                  Rooms you can walk through before you commit.
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="max-w-[40ch] text-[0.92rem] leading-[1.75] text-quiet md:justify-self-end">
                  Finished projects across Bhubaneswar, Cuttack and Puri. Every
                  photograph is a house someone lives in, not a render. Open one
                  to walk through the room.
                </p>
              </Reveal>
            </div>

            <div className="mt-12">
              <Gallery items={gallery} />
            </div>
          </div>
        </section>

        {/* Cost estimator */}
        <section id="estimator" className="border-t border-line bg-paper/40">
          <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
              <Reveal className="lg:sticky lg:top-28 lg:self-start">
                <p className="label">Cost estimator</p>
                <p className="mt-6 max-w-[22ch] text-[0.82rem] leading-relaxed text-quiet">
                  Six choices and a floor area, then a number we will defend on
                  site.
                </p>
              </Reveal>

              <div>
                <Reveal>
                  <h2 className="display-lg max-w-[18ch] text-ink">
                    A ballpark before the first phone call.
                  </h2>
                  <p className="lede mt-6 max-w-[50ch]">
                    Most people arrive with a number in their head and no way to
                    test it. Set the scope, the size and the finish, and the
                    studio gets exactly the range you saw — not a lead with a
                    blank budget.
                  </p>
                </Reveal>

                <Reveal delay={80} className="mt-10">
                  <CostEstimator />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="border-t border-line">
          <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
              <Reveal className="lg:sticky lg:top-28 lg:self-start">
                <p className="label">How we work</p>
                <p className="mt-6 max-w-[22ch] text-[0.82rem] leading-relaxed text-quiet">
                  One contract, one budget, one person to call.
                </p>
              </Reveal>

              <div>
                <Reveal>
                  <h2 className="display-lg max-w-[17ch] text-ink">
                    Four stages, start to keys.
                  </h2>
                </Reveal>

                <ol className="mt-10 border-t border-line">
                  {processSteps.map((step, index) => (
                    <Reveal
                      as="li"
                      key={step.number}
                      delay={index * 70}
                      className="group grid gap-3 border-b border-line py-7 sm:grid-cols-[4rem_minmax(0,1fr)_1.25fr] sm:items-baseline sm:gap-8"
                    >
                      <span className="num font-display text-[1.35rem] text-brass/85 transition-transform duration-500 group-hover:-translate-y-1">
                        {step.number}
                      </span>
                      <h3 className="display-md text-ink">{step.title}</h3>
                      <p className="max-w-[48ch] text-[0.9rem] leading-[1.72] text-quiet">
                        {step.body}
                      </p>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Questions — real answers, and the source of the FAQPage schema. */}
        <section id="questions" className="border-t border-line">
          <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
              <Reveal className="lg:sticky lg:top-28 lg:self-start">
                <p className="label">Questions</p>
                <p className="mt-6 max-w-[22ch] text-[0.82rem] leading-relaxed text-quiet">
                  Answered before you pick up the phone.
                </p>
              </Reveal>

              <div>
                <Reveal>
                  <h2 className="display-lg max-w-[20ch] text-ink">
                    What people ask before the first meeting.
                  </h2>
                </Reveal>

                <div className="mt-10 border-t border-line">
                  {faqs.map((faq) => (
                    <details
                      key={faq.q}
                      className="group border-b border-line py-5"
                    >
                      <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 [&::-webkit-details-marker]:hidden">
                        <h3 className="font-display text-[1.12rem] leading-snug text-ink transition-colors duration-300 group-hover:text-brass sm:text-[1.28rem]">
                          {faq.q}
                        </h3>
                        <span
                          aria-hidden="true"
                          className="relative mt-1 block h-3 w-3 shrink-0"
                        >
                          <span className="absolute left-0 top-1/2 h-px w-3 bg-brass" />
                          <span className="absolute left-1/2 top-0 h-3 w-px bg-brass transition-transform duration-300 group-open:rotate-90" />
                        </span>
                      </summary>
                      <p className="mt-3 max-w-[64ch] text-[0.92rem] leading-[1.78] text-ink-soft">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video journal */}
        <section
          id="journal"
          className="relative overflow-hidden bg-indigo text-plaster"
        >
          <div className="grain grain-light" aria-hidden="true" />
          <div className="relative mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
              <Reveal>
                <p className="label !text-brass-light">Video journal</p>
                <h2 className="display-lg mt-5 max-w-[17ch] text-plaster">
                  Short films from live sites.
                </h2>
              </Reveal>
              <Reveal delay={90}>
                <p className="max-w-[38ch] text-[0.9rem] leading-[1.75] text-plaster/55 md:justify-self-end">
                  Cut on site, mostly handheld. No drone shots, no soundtrack —
                  just the room and the people making it.
                </p>
              </Reveal>
            </div>

            <div className="mt-12">
              <VideoJournal videos={videos} />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t border-line">
          <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
              <div>
                <Reveal>
                  <p className="label">Contact</p>
                  <h2 className="display-lg mt-5 max-w-[13ch] text-ink">
                    Tell us about the room.
                  </h2>
                  <p className="lede mt-6 max-w-[42ch]">
                    Send the rough shape of it — where it is, what you use it
                    for, and what you can spend. A principal from the studio
                    replies within one working day, usually with questions before
                    numbers.
                  </p>
                </Reveal>

                <Reveal delay={120} className="mt-10 border-t border-line">
                  <dl className="grid gap-6 py-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-[0.72rem] text-quiet">Studio</dt>
                      <dd className="mt-1.5 text-[0.9rem] leading-relaxed text-ink">
                        {studio.addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.72rem] text-quiet">Direct</dt>
                      <dd className="mt-1.5 text-[0.9rem] leading-relaxed">
                        <a
                          href={studio.phoneHref}
                          className="block text-ink transition-colors hover:text-brass"
                        >
                          {studio.phone}
                        </a>
                        <a
                          href={`mailto:${studio.email}`}
                          className="block text-ink transition-colors hover:text-brass"
                        >
                          {studio.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.72rem] text-quiet">Hours</dt>
                      <dd className="mt-1.5 text-[0.9rem] leading-relaxed text-ink">
                        {studio.hours}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.72rem] text-quiet">Site visits</dt>
                      <dd className="mt-1.5 text-[0.9rem] leading-relaxed text-ink">
                        Bhubaneswar, Cuttack and Puri. Elsewhere in Odisha by
                        arrangement.
                      </dd>
                    </div>
                  </dl>
                </Reveal>
              </div>

              <Reveal delay={60} className="border border-line bg-paper p-6 sm:p-10">
                <h3 className="font-display text-[1.5rem] text-ink">
                  Enquiry form
                </h3>
                <p className="mt-2 mb-8 max-w-[44ch] text-[0.82rem] leading-relaxed text-quiet">
                  Four fields and a paragraph is enough to start. All of it comes
                  straight to the studio desk.
                </p>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd([faqSchema(faqs)]) }}
      />
    </>
  );
}
