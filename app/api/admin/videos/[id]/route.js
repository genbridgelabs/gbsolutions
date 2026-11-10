import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Video } from "@/lib/models/video";
import {
  fieldIssues,
  publishedSchema,
  videoEntrySchema,
} from "@/lib/validation";
import { serializeVideo } from "@/lib/videos";

export const dynamic = "force-dynamic";

async function findEntry(id) {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  return Video.findById(id);
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
    const entry = await findEntry(id);
    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const toggle = publishedSchema.safeParse(body);
    if (toggle.success && Object.keys(body ?? {}).length === 1) {
      entry.published = toggle.data.published;
      await entry.save();
      return NextResponse.json({ item: serializeVideo(entry) });
    }

    const parsed = videoEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Some fields need another look.",
          issues: fieldIssues(parsed.error),
        },
        { status: 400 }
      );
    }

    entry.set(parsed.data);
    await entry.save();
    return NextResponse.json({ item: serializeVideo(entry) });
  } catch (error) {
    console.error("videos: update failed", error?.message);
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
    const entry = await findEntry(id);
    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await entry.deleteOne();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("videos: delete failed", error?.message);
    return NextResponse.json(
      { error: "That film could not be deleted." },
      { status: 503 }
    );
  }
}
