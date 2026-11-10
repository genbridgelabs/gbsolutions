import { NextResponse } from "next/server";
import {
  checkCredentials,
  issueSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

const attempts = (globalThis.__gbLoginRate ??= new Map());
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function limited(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request) {
  const ip =
    (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "local";

  if (limited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body?.email || "");
  const password = String(body?.password || "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are both needed." },
      { status: 400 }
    );
  }

  if (!checkCredentials(email, password)) {
    return NextResponse.json(
      { error: "Those credentials do not match the studio account." },
      { status: 401 }
    );
  }

  const token = await issueSession(email.trim().toLowerCase());
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
