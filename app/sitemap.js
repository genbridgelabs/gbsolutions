import { listGallery } from "@/lib/gallery";
import { absoluteUrl } from "@/lib/seo";

// Generated from the same data the archive renders, so a project published in
// the admin appears in the sitemap without anyone editing a list by hand.
export const revalidate = 600;

export default async function sitemap() {
  const projects = await listGallery();
  const now = new Date();

  const pages = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/work"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const projectPages = projects.map((project) => ({
    url: absoluteUrl(`/work/${project.slug}`),
    lastModified: project.updatedAt ? new Date(project.updatedAt) : now,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...pages, ...projectPages];
}
