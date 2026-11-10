import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const VIDEO_TYPES = { "video/mp4": "mp4", "video/webm": "webm" };

const MAX_IMAGE = 12 * 1024 * 1024;
const MAX_VIDEO = 80 * 1024 * 1024;

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "That upload could not be read." },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file was attached." }, { status: 400 });
  }

  const videoExt = VIDEO_TYPES[file.type];
  const imageExt = IMAGE_TYPES[file.type];
  const extension = imageExt || videoExt;

  if (!extension) {
    return NextResponse.json(
      {
        error:
          "Use a JPG, PNG, WebP or AVIF image, or an MP4 / WebM video.",
      },
      { status: 415 }
    );
  }

  const limit = videoExt ? MAX_VIDEO : MAX_IMAGE;
  if (file.size > limit) {
    return NextResponse.json(
      {
        error: videoExt
          ? "That video is over 80 MB. Trim it or host it on YouTube / Vimeo."
          : "That image is over 12 MB. Resize it first.",
      },
      { status: 413 }
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    // Uploads live beside the bundled media so the dev server can stream them
    // with range requests. On a serverless host, swap this for object storage.
    const directory = path.join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });

    const name = `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}.${extension}`;
    await writeFile(path.join(directory, name), bytes);

    return NextResponse.json({
      url: `/uploads/${name}`,
      kind: videoExt ? "video" : "image",
      size: file.size,
    });
  } catch (error) {
    console.error("upload: failed", error?.message);
    return NextResponse.json(
      { error: "The file could not be written to disk." },
      { status: 500 }
    );
  }
}
