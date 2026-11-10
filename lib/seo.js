import { places, studio } from "@/lib/content";

// Canonicals, sitemap entries and JSON-LD @ids all have to be absolute, so the
// site URL lives here once. The fallback is the domain in .env.example; a
// missing env var must never ship a canonical that points at localhost.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gbatelier.in"
).replace(/\/+$/, "");

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const shareImage = {
  url: "/media/og-cover.png",
  width: 1200,
  height: 630,
  alt: "A GB Solutions living room in lime plaster and oak, lit by a tall window",
};

const studioId = `${siteUrl}/#studio`;
const siteId = `${siteUrl}/#website`;

export function studioSchema() {
  return {
    "@type": ["HomeAndConstructionBusiness", "ProfessionalService"],
    "@id": studioId,
    name: studio.name,
    alternateName: "GB Solutions Interiors",
    description:
      "Interior architecture and turnkey build studio in Bhubaneswar, working across Odisha in lime plaster, laterite, teak and brass.",
    url: siteUrl,
    logo: absoluteUrl("/brand/logo-ink.png"),
    image: absoluteUrl(shareImage.url),
    telephone: studio.phone,
    email: studio.email,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    address: {
      "@type": "PostalAddress",
      streetAddress: studio.addressLines[0],
      addressLocality: "Bhubaneswar",
      addressRegion: "Odisha",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 20.2961,
      longitude: 85.8245,
    },
    areaServed: places.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    knowsAbout: [
      "interior design",
      "interior architecture",
      "turnkey interiors",
      "home renovation",
      "workspace interiors",
      "hospitality interiors",
    ],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": siteId,
    url: siteUrl,
    name: studio.name,
    inLanguage: "en-IN",
    publisher: { "@id": studioId },
  };
}

export function breadcrumbSchema(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function projectSchema(project) {
  return {
    "@type": "CreativeWork",
    "@id": absoluteUrl(`/work/${project.slug}#project`),
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: absoluteUrl(`/work/${project.slug}`),
    image: project.images.length
      ? project.images.map((image) => absoluteUrl(image.url))
      : [absoluteUrl(project.cover)],
    dateCreated: project.year || undefined,
    genre: project.category || undefined,
    creator: { "@id": studioId },
    locationCreated: {
      "@type": "Place",
      name: project.place,
      address: {
        "@type": "PostalAddress",
        addressLocality: project.place,
        addressRegion: "Odisha",
        addressCountry: "IN",
      },
    },
  };
}

export function faqSchema(faqs) {
  return {
    "@type": "FAQPage",
    "@id": `${siteUrl}/#questions`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function jsonLd(graph) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}
