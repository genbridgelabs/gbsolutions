import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { GalleryItem } from "@/lib/models/gallery-item";
import {
  fieldIssues,
  galleryItemSchema,
  publishedSchema,
} from "@/lib/validation";
import { serializeGalleryItem, uniqueSlug } from "@/lib/gallery";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

async function findItem(id) {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  return GalleryItem.findById(id);
}

export async function PATCH(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);

  try {
    await connectDB();
    const item = await findItem(id);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // A publish toggle sends nothing but the flag.
    const toggle = publishedSchema.safeParse(body);
    if (toggle.success && Object.keys(body ?? {}).length === 1) {
      item.published = toggle.data.published;
      await item.save();
      return NextResponse.json({ item: serializeGalleryItem(item) });
    }

    const parsed = galleryItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Some fields need another look.",
          issues: fieldIssues(parsed.error),
        },
        { status: 400 }
      );
    }

    item.set(parsed.data);
    // Old rows were created before slugs existed; give them one on first edit.
    if (!item.slug) item.slug = await uniqueSlug(slugify(item.title), item._id);
    await item.save();
    return NextResponse.json({ item: serializeGalleryItem(item) });
  } catch (error) {
    console.error("gallery: update failed", error?.message);
    return NextResponse.json(
      { error: "That change could not be saved." },
      { status: 503 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectDB();
    const item = await findItem(id);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await item.deleteOne();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("gallery: delete failed", error?.message);
    return NextResponse.json(
      { error: "That project could not be deleted." },
      { status: 503 }
    );
  }
}
