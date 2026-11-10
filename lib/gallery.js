import { connectDB } from "@/lib/mongodb";
import { GalleryItem } from "@/lib/models/gallery-item";
import { gallerySeed } from "@/lib/seed-data.mjs";
import { slugify } from "@/lib/slug";

export function serializeGalleryItem(doc) {
  return {
    id: String(doc._id ?? doc.id ?? doc.slug ?? ""),
    slug: doc.slug || slugify(doc.title),
    title: doc.title || "",
    category: doc.category || "Homes",
    typeLabel: doc.typeLabel || "",
    place: doc.place || "",
    year: doc.year || "",
    summary: doc.summary || "",
    description: doc.description || "",
    cover: doc.cover || "",
    coverAlt: doc.coverAlt || "",
    images: (doc.images || []).map((image) => ({
      url: image.url || "",
      alt: image.alt || "",
      caption: image.caption || "",
    })),
    order: Number.isFinite(doc.order) ? doc.order : 0,
    published: doc.published !== false,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}

function bundledItems() {
  return gallerySeed.map((item, index) =>
    serializeGalleryItem({ ...item, id: `seed-${item.slug}`, order: index })
  );
}

// The page must never look broken because Atlas blinked, so a failed or empty
// read falls back to the content the site shipped with.
export async function listGallery({ publishedOnly = true } = {}) {
  try {
    await connectDB();
    const docs = await GalleryItem.find(publishedOnly ? { published: true } : {})
      .sort({ order: 1, createdAt: 1 })
      .lean();
    if (!docs.length) return bundledItems();
    return docs.map(serializeGalleryItem);
  } catch (error) {
    console.error("gallery: using bundled content —", error?.message);
    return bundledItems();
  }
}

// Resolve /work/[slug]: stored slugs first, then the title as a fallback so a
// project added before slugs existed still has a stable address.
export async function getGalleryItem(slug) {
  if (!slug) return null;
  const wanted = String(slug).toLowerCase();

  try {
    await connectDB();
    const docs = await GalleryItem.find({ published: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    const found = docs.find(
      (doc) => (doc.slug || slugify(doc.title)) === wanted
    );
    return found ? serializeGalleryItem(found) : null;
  } catch (error) {
    console.error("gallery: slug lookup fell back —", error?.message);
    return (
      bundledItems().find((item) => item.slug === wanted) || null
    );
  }
}

// Slugs stay stable once set: renaming a project must not break a link that is
// already in a WhatsApp thread.
export async function uniqueSlug(base, excludeId) {
  const root = slugify(base);
  let candidate = root;
  let counter = 1;
  while (
    await GalleryItem.exists({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    counter += 1;
    candidate = `${root}-${counter}`;
  }
  return candidate;
}
