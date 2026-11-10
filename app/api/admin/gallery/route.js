import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { GalleryItem } from "@/lib/models/gallery-item";
import {
  fieldIssues,
  galleryItemSchema,
  reorderSchema,
} from "@/lib/validation";
import { serializeGalleryItem, uniqueSlug } from "@/lib/gallery";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const docs = await GalleryItem.find({})
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return NextResponse.json({ items: docs.map(serializeGalleryItem) });
  } catch (error) {
    console.error("gallery: list failed", error?.message);
    return NextResponse.json(
      { error: "The gallery could not be read." },
      { status: 503 }
    );
  }
}

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = galleryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Some fields need another look.", issues: fieldIssues(parsed.error) },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const count = await GalleryItem.countDocuments({});
    const slug = await uniqueSlug(slugify(parsed.data.title));
    const doc = await GalleryItem.create({ ...parsed.data, slug, order: count });
    return NextResponse.json(
      { item: serializeGalleryItem(doc) },
      { status: 201 }
    );
  } catch (error) {
    console.error("gallery: create failed", error?.message);
    return NextResponse.json(
      { error: "That project could not be saved." },
      { status: 503 }
    );
  }
}

// Reordering sends the whole id list; index becomes the stored order.
export async function PATCH(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Nothing to reorder." }, { status: 400 });
  }

  try {
    await connectDB();
    await Promise.all(
      parsed.data.ids.map((id, index) =>
        GalleryItem.findByIdAndUpdate(id, { order: index })
      )
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("gallery: reorder failed", error?.message);
    return NextResponse.json(
      { error: "The new order could not be saved." },
      { status: 503 }
    );
  }
}
