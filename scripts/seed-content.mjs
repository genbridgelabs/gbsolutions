// Seeds gallery + video journal through the real admin API, so the endpoints
// themselves are exercised. Idempotent: it only writes when a collection is
// empty, unless you pass --force.

import { gallerySeed, videoSeed } from "../lib/seed-data.mjs";

const base = process.env.SEED_BASE_URL || "http://localhost:3000";
const force = process.argv.includes("--force");

async function login() {
  const response = await fetch(`${base}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    }),
  });
  if (!response.ok) {
    throw new Error(`Login failed (${response.status}). Check .env.local.`);
  }
  const cookie = response.headers.getSetCookie?.()?.[0] || response.headers.get("set-cookie");
  if (!cookie) throw new Error("Login returned no session cookie.");
  return cookie.split(";")[0];
}

async function read(path, cookie) {
  const response = await fetch(`${base}${path}`, { headers: { Cookie: cookie } });
  if (!response.ok) throw new Error(`GET ${path} → ${response.status}`);
  return response.json();
}

async function post(path, cookie, body) {
  const response = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`POST ${path} → ${response.status} ${detail}`);
  }
  return response.json();
}

const cookie = await login();

const gallery = await read("/api/admin/gallery", cookie);
if (gallery.items.length === 0 || force) {
  for (const item of gallerySeed) {
    const { slug: _slug, ...payload } = item;
    await post("/api/admin/gallery", cookie, payload);
  }
  console.log(`gallery: ${gallerySeed.length} projects written`);
} else {
  console.log(`gallery: ${gallery.items.length} already there, skipped`);
}

const videos = await read("/api/admin/videos", cookie);
if (videos.items.length === 0 || force) {
  for (const item of videoSeed) {
    await post("/api/admin/videos", cookie, item);
  }
  console.log(`videos: ${videoSeed.length} films written`);
} else {
  console.log(`videos: ${videos.items.length} already there, skipped`);
}
