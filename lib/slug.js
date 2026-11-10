// One slug function for both the server (generating) and the client (linking),
// so /work links never disagree with what the route resolves.
export function slugify(value = "") {
  const slug = String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
  return slug || "project";
}
