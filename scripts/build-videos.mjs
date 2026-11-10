// Builds the video journal clips. There is no camera footage in this project,
// so each clip is cut from a graded still: a slow push, film grain, a fade,
// H.264 so it plays in every browser without a plugin.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";

const run = promisify(execFile);
const root = process.cwd();
const outDir = path.join(root, "public", "media", "video");

const FPS = 25;
const SECONDS = 7;
const FRAMES = FPS * SECONDS;

const clips = [
  {
    id: "north-light",
    from: "public/media/detail-living.jpg",
    move: "push",
  },
  {
    id: "lime",
    from: "public/media/detail-stair.jpg",
    move: "drift",
  },
  {
    id: "courtyard",
    from: "public/media/project-courtyard.jpg",
    move: "pull",
  },
  {
    id: "studio",
    from: "public/media/studio.jpg",
    move: "push",
  },
];

// zoompan generates the whole clip from one still frame (d = output frames).
// Feeding it a looped input instead makes it drift to a blown-out white frame.
function motion(move) {
  const centreX = "iw/2-(iw/zoom/2)";
  const centreY = "ih/2-(ih/zoom/2)";
  const out = `d=${FRAMES}:s=1280x720:fps=${FPS}`;
  if (move === "pull") {
    return `zoompan=z='max(1.0,1.16-0.0009*on)':x='${centreX}':y='${centreY}':${out}`;
  }
  if (move === "drift") {
    return `zoompan=z='1.10':x='(iw-iw/zoom)*on/${FRAMES - 1}':y='${centreY}':${out}`;
  }
  return `zoompan=z='min(zoom+0.0009,1.18)':x='${centreX}':y='${centreY}':${out}`;
}

await mkdir(outDir, { recursive: true });

for (const clip of clips) {
  const source = path.join(root, clip.from);
  const videoPath = path.join(outDir, `${clip.id}.mp4`);
  const posterPath = path.join(outDir, `${clip.id}.jpg`);

  const filter = [
    "scale=2560:1440:force_original_aspect_ratio=increase",
    "crop=2560:1440",
    motion(clip.move),
    // eq brightness is -1…1, not 0…1: anything near 1 blows the frame white.
    "eq=saturation=0.9:contrast=1.04:brightness=-0.01",
    "noise=alls=5:allf=t",
    "fade=t=in:st=0:d=0.6",
    `fade=t=out:st=${SECONDS - 1}:d=1`,
    "format=yuv420p",
  ].join(",");

  await run(
    ffmpeg,
    [
      "-y",
      "-i",
      source,
      "-t",
      String(SECONDS),
      "-vf",
      filter,
      "-r",
      String(FPS),
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "25",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      videoPath,
    ],
    { maxBuffer: 1024 * 1024 * 16 }
  );

  await sharp(source)
    .resize(1280, 720, { fit: "cover", position: "attention" })
    .modulate({ saturation: 0.9 })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(posterPath);

  const { size } = await stat(videoPath);
  console.log(
    `${clip.id}.mp4  ${(size / 1024 / 1024).toFixed(2)} MB  (poster ${clip.id}.jpg)`
  );
}
