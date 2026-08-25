import { spawn } from "node:child_process";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import youtubeDl from "youtube-dl-exec";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const COOKIES_FILE = process.env.COOKIES_FILE || "";

function corsOrigin() {
  const value = process.env.FRONTEND_ORIGIN;
  if (!value || value === "true" || value === "*") return true;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

const HOST_RULES = [
  { platform: "youtube", hosts: ["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be"] },
  { platform: "tiktok", hosts: ["tiktok.com", "www.tiktok.com", "m.tiktok.com", "vm.tiktok.com", "vt.tiktok.com"] },
  { platform: "instagram", hosts: ["instagram.com", "www.instagram.com", "instagr.am"] },
  { platform: "facebook", hosts: ["facebook.com", "www.facebook.com", "m.facebook.com", "fb.watch", "fb.me"] },
];

function hostnameOf(url) {
  return new URL(url).hostname.toLowerCase();
}

function detectPlatform(url) {
  const host = hostnameOf(url);
  return HOST_RULES.find((rule) =>
    rule.hosts.some((h) => host === h || host.endsWith(`.${h}`))
  )?.platform;
}

function parsePublicUrl(raw) {
  if (typeof raw !== "string" || raw.length > 2048) {
    throw new Error("Invalid URL");
  }
  const url = new URL(raw.trim());
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http/https URLs are allowed");
  }
  const platform = detectPlatform(url.href);
  if (!platform) {
    throw new Error("Only TikTok, Instagram, YouTube and Facebook URLs are supported");
  }
  return { url: url.href, platform };
}

function ytdlFlags(extra = {}) {
  return {
    noCheckCertificates: true,
    noWarnings: true,
    noPlaylist: true,
    restrictFilenames: true,
    ffmpegLocation: ffmpegInstaller.path,
    addHeader: ["referer:https://www.youtube.com", "user-agent:Mozilla/5.0"],
    ...(COOKIES_FILE ? { cookies: COOKIES_FILE } : {}),
    ...extra,
  };
}

function safeFilename(title, ext = "mp4") {
  const base = String(title || "video")
    .replace(/[^\w\s.-]+/g, "")
    .trim()
    .slice(0, 80) || "video";
  return `${base}.${ext}`;
}

function pickFormats(info) {
  const formats = Array.isArray(info.formats) ? info.formats : [];
  const progressive = formats.filter(
    (f) =>
      f.format_id &&
      f.vcodec &&
      f.vcodec !== "none" &&
      f.acodec &&
      f.acodec !== "none" &&
      f.protocol !== "m3u8_native" &&
      f.protocol !== "m3u8"
  );

  const videoHeights = [
    ...new Set(
      formats
        .filter((f) => f.vcodec && f.vcodec !== "none" && f.height)
        .map((f) => f.height)
    ),
  ]
    .sort((a, b) => b - a)
    .slice(0, 4);

  const seen = new Set();
  const unique = [];
  for (const format of progressive.sort((a, b) => (b.height || 0) - (a.height || 0))) {
    const key = `${format.height || "sd"}-${format.ext}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({
      id: String(format.format_id),
      label: `${format.height || "SD"}p · ${String(format.ext || "mp4").toUpperCase()}`,
      ext: format.ext || "mp4",
      filesize: format.filesize || format.filesize_approx || null,
    });
    if (unique.length >= 5) break;
  }

  const merged = videoHeights.map((height) => ({
    id: `bv*[height<=${height}]+ba/b`,
    label: `${height}p`,
    ext: "mp4",
    filesize: null,
  }));

  return [
    { id: "bv*+ba/b", label: "Best available", ext: "mp4", filesize: null },
    ...unique,
    ...merged.filter((item) => !unique.some((u) => u.label.startsWith(`${item.label}`))),
    { id: "bestaudio", label: "Audio only", ext: "m4a", filesize: null },
  ];
}

const app = express();
app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: corsOrigin(),
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(express.json({ limit: "16kb" }));

const infoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
});

const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "videodownloader-api" });
});

app.post("/api/info", infoLimiter, async (req, res) => {
  try {
    const { url, platform } = parsePublicUrl(req.body?.url);
    const info = await youtubeDl(url, ytdlFlags({ dumpSingleJson: true, skipDownload: true }));

    res.json({
      platform,
      id: info.id || null,
      title: info.title || "Untitled",
      thumbnail: info.thumbnail || info.thumbnails?.at(-1)?.url || null,
      duration: info.duration || null,
      uploader: info.uploader || info.channel || null,
      formats: pickFormats(info),
    });
  } catch (error) {
    const message = error?.stderr || error?.message || "Could not fetch video info";
    res.status(400).json({ error: String(message).slice(0, 400) });
  }
});

app.get("/api/download", downloadLimiter, async (req, res) => {
  let child;
  try {
    const { url } = parsePublicUrl(req.query.url);
    const format = typeof req.query.format === "string" && req.query.format.length < 80
      ? req.query.format
      : "bv*+ba/b";
    const title = typeof req.query.title === "string" ? req.query.title : "video";
    const ext = format.includes("bestaudio") ? "m4a" : "mp4";

    const args = [
      url,
      "-f",
      format,
      "-o",
      "-",
      "--no-playlist",
      "--no-warnings",
      "--no-check-certificates",
      "--ffmpeg-location",
      ffmpegInstaller.path,
      "--merge-output-format",
      "mp4",
    ];
    if (COOKIES_FILE) args.push("--cookies", COOKIES_FILE);

    child = spawn(youtubeDl.constants.YOUTUBE_DL_PATH, args, {
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });

    let stderr = "";
    let started = false;
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > 4000) stderr = stderr.slice(-4000);
    });

    child.stdout.on("data", (chunk) => {
      if (!started) {
        started = true;
        res.setHeader("Content-Type", ext === "m4a" ? "audio/mp4" : "video/mp4");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${safeFilename(title, ext)}"`
        );
      }
      res.write(chunk);
    });

    child.on("error", () => {
      if (!res.headersSent) {
        res.status(500).json({ error: "Download failed to start" });
      } else {
        res.end();
      }
    });

    child.on("close", (code) => {
      if (!started) {
        const message = stderr.trim() || `yt-dlp exited with code ${code}`;
        if (!res.headersSent) {
          res.status(400).json({ error: message.slice(0, 400) });
        }
        return;
      }
      res.end();
    });

    req.on("close", () => {
      if (child && !child.killed) child.kill("SIGTERM");
    });
  } catch (error) {
    if (child && !child.killed) child.kill("SIGTERM");
    if (!res.headersSent) {
      res.status(400).json({ error: error.message || "Download failed" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`API ready on port ${PORT}`);
});
