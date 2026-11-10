import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  createSessionToken,
  SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/session";

export { SESSION_COOKIE };

/** Constant-time comparison against the single admin account in the env. */
export function checkCredentials(email, password) {
  const expectedEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || "";
  if (!expectedEmail || !expectedPassword) return false;

  const digest = (value) => createHash("sha256").update(String(value)).digest();
  const emailOk = timingSafeEqual(
    digest(String(email ?? "").trim().toLowerCase()),
    digest(expectedEmail)
  );
  const passwordOk = timingSafeEqual(
    digest(String(password ?? "")),
    digest(expectedPassword)
  );
  return emailOk && passwordOk;
}

export async function getAdminSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function issueSession(email) {
  return createSessionToken(email);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 8,
};
