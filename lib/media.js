// Shared by the public journal and the admin forms: turn a stored source into
// something the browser can actually play, without trusting a pasted URL blindly.

const YOUTUBE =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/;
const VIMEO = /vimeo\.com\/(?:video\/)?(\d{4,})/;

export function youtubeId(value = "") {
  return value.match(YOUTUBE)?.[1] || "";
}

export function vimeoId(value = "") {
  return value.match(VIMEO)?.[1] || "";
}

export function guessSource(value = "") {
  if (youtubeId(value)) return "youtube";
  if (vimeoId(value)) return "vimeo";
  return "file";
}

export function embedUrl(source, src) {
  if (source === "youtube") {
    const id = youtubeId(src);
    return id
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
      : "";
  }
  if (source === "vimeo") {
    const id = vimeoId(src);
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : "";
  }
  return "";
}

// Seconds described as 2:14, used when the admin leaves the length blank.
export function clock(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
