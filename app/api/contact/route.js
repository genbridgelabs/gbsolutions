import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Lead } from "@/lib/models/lead";
import { fieldIssues, leadSchema } from "@/lib/validation";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 6;

const buckets = (globalThis.__gbContactRate ??= new Map());

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  return forwarded.split(",")[0].trim() || "local";
}

function rateLimited(ip) {
  const now = Date.now();
  const entry = buckets.get(ip);
  if (!entry || now > entry.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function reference(id) {
  return `GB-${String(id).slice(-5).toUpperCase()}`;
}

export async function POST(request) {
  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "That is a lot of enquiries from one place. Call the studio instead and we will pick up.",
      },
      { status: 429 }
    );
  }

  let body;
  try {
    const contentType = request.headers.get("content-type") || "";
    body = contentType.includes("application/json")
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return NextResponse.json(
      { error: "We could not read that request." },
      { status: 400 }
    );
  }

  // Honeypot: real people never fill the hidden field.
  if (typeof body?.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, reference: reference(Date.now()) });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Some details need a second look.",
        issues: fieldIssues(parsed.error),
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    await connectDB();
    const lead = await Lead.create({
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      projectType: data.projectType,
      city: data.city,
      budget: data.budget,
      message: data.message,
      source: "website",
      ipHash: createHash("sha256")
        .update(`${ip}:${process.env.SESSION_SECRET || "salt"}`)
        .digest("hex")
        .slice(0, 16),
    });

    return NextResponse.json({
      ok: true,
      reference: reference(lead._id),
    });
  } catch (error) {
    console.error("contact: failed to save enquiry", error?.message);
    return NextResponse.json(
      {
        error:
          "The studio desk is not reachable right now. Please call us and we will take the details down.",
      },
      { status: 503 }
    );
  }
}
