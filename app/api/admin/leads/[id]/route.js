import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Lead } from "@/lib/models/lead";
import { serializeLead } from "@/lib/leads";
import { updateLeadSchema } from "@/lib/validation";

async function guard() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PATCH(request, { params }) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Unknown enquiry." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = updateLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Nothing valid to update." }, { status: 400 });
  }

  const update = {};
  if (parsed.data.status) update.status = parsed.data.status;
  if (typeof parsed.data.adminNote === "string") {
    update.adminNote = parsed.data.adminNote.slice(0, 2000);
  }

  try {
    await connectDB();
    const lead = await Lead.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!lead) {
      return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, lead: serializeLead(lead) });
  } catch (error) {
    console.error("admin: update failed", error?.message);
    return NextResponse.json({ error: "Could not save that." }, { status: 503 });
  }
}

export async function DELETE(_request, { params }) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Unknown enquiry." }, { status: 400 });
  }

  try {
    await connectDB();
    const removed = await Lead.findByIdAndDelete(id).lean();
    if (!removed) {
      return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin: delete failed", error?.message);
    return NextResponse.json({ error: "Could not delete that." }, { status: 503 });
  }
}
