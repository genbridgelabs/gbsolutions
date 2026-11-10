import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Lead } from "@/lib/models/lead";
import { estimatorSchema, fieldIssues } from "@/lib/validation";
import {
  budgetBucket,
  computeEstimate,
  projectTypeFor,
} from "@/lib/estimator";
import { formatINR } from "@/lib/format";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 6;

const buckets = (globalThis.__gbEstimatorRate ??= new Map());

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
          "That is a lot of estimates from one place. Call the studio instead and we will pick up.",
      },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We could not read that request." },
      { status: 400 }
    );
  }

  if (typeof body?.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, reference: reference(Date.now()) });
  }

  const parsed = estimatorSchema.safeParse(body);
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
  // Recompute here, never trust the numbers the browser sent.
  const range = computeEstimate(data);
  const notes = data.notes.trim();

  const message = [
    `Ballpark from the site estimator: ${formatINR(range.min)} – ${formatINR(
      range.max
    )}.`,
    `${range.summary}.`,
    notes ? `Notes: ${notes}` : "No notes — send the estimate and call me.",
  ].join("\n\n");

  try {
    await connectDB();
    const lead = await Lead.create({
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      projectType: projectTypeFor(data.scope, data.work),
      city: data.city,
      budget: budgetBucket(range.max),
      message,
      source: "estimator",
      estimate: {
        scope: range.scope,
        size: range.size,
        style: range.style,
        work: range.work,
        area: range.area,
        min: range.min,
        max: range.max,
        summary: range.summary,
      },
      ipHash: createHash("sha256")
        .update(`${ip}:${process.env.SESSION_SECRET || "salt"}`)
        .digest("hex")
        .slice(0, 16),
    });

    return NextResponse.json({
      ok: true,
      reference: reference(lead._id),
      range: { min: range.min, max: range.max },
    });
  } catch (error) {
    console.error("estimator: failed to save enquiry", error?.message);
    return NextResponse.json(
      {
        error:
          "The studio desk is not reachable right now. Please call us with the estimate and we will take it down.",
      },
      { status: 503 }
    );
  }
}
