import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "gb_studio_session";
export const SESSION_HOURS = 8;

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 24) {
    throw new Error("SESSION_SECRET is missing or too short. Add it to .env.local.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(email) {
  return new SignJWT({ role: "admin", email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(key());
}

export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (payload.role !== "admin") return null;
    return { email: payload.email, expiresAt: payload.exp };
  } catch {
    return null;
  }
}
