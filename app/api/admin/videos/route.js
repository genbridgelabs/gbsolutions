import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Video } from "@/lib/models/video";
import {
  fieldIssues,
  reorderSchema,
  videoEntrySchema,
} from "@/lib/validation";
import { serializeVideo } from "@/lib/videos";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const docs = await Video.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ items: docs.map(serializeVideo) });
  } catch (error) {
    console.error("videos: list failed", error?.message);
    return NextResponse.json(
      { error: "The video journal could not be read." },
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
  const parsed = videoEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Some fields need another look.", issues: fieldIssues(parsed.error) },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const count = await Video.countDocuments({});
    const doc = await Video.create({ ...parsed.data, order: count });
    return NextResponse.json({ item: serializeVideo(doc) }, { status: 201 });
  } catch (error) {
    console.error("videos: create failed", error?.message);
    return NextResponse.json(
      { error: "That film could not be saved." },
      { status: 503 }
    );
  }
}

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
        Video.findByIdAndUpdate(id, { order: index })
      )
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("videos: reorder failed", error?.message);
    return NextResponse.json(
      { error: "The new order could not be saved." },
      { status: 503 }
    );
  }
}
