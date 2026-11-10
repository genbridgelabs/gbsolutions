import { connectDB } from "@/lib/mongodb";
import { Video } from "@/lib/models/video";
import { videoSeed } from "@/lib/seed-data.mjs";
import { embedUrl } from "@/lib/media";

export function serializeVideo(doc) {
  const source = doc.source || "file";
  return {
    id: String(doc._id ?? doc.id ?? doc.title ?? ""),
    title: doc.title || "",
    place: doc.place || "",
    recordedOn: doc.recordedOn || "",
    duration: doc.duration || "",
    note: doc.note || "",
    description: doc.description || "",
    poster: doc.poster || "",
    posterAlt: doc.posterAlt || "",
    source,
    src: doc.src || "",
    embed: source === "file" ? "" : embedUrl(source, doc.src),
    order: Number.isFinite(doc.order) ? doc.order : 0,
    published: doc.published !== false,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}

function bundledVideos() {
  return videoSeed.map((item, index) =>
    serializeVideo({ ...item, id: `seed-${index}`, order: index })
  );
}

export async function listVideos({ publishedOnly = true } = {}) {
  try {
    await connectDB();
    const docs = await Video.find(publishedOnly ? { published: true } : {})
      .sort({ order: 1, createdAt: 1 })
      .lean();
    if (!docs.length) return bundledVideos();
    return docs.map(serializeVideo);
  } catch (error) {
    console.error("videos: using bundled content —", error?.message);
    return bundledVideos();
  }
}
