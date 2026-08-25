import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import ytdl from "@distube/ytdl-core";
import TiktokDL from "@tobyg74/tiktok-api-dl";
import { instagramGetUrl } from "instagram-url-direct";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 4000;

function corsOrigin() {
  const value = process.env.FRONTEND_ORIGIN;
  if (!value || value === "true" || value === "*") return true;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

const HOST_RULES = [
  { platform: "youtube", hosts: ["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be"] },
  { platform: "tiktok", hosts: ["tiktok.com", "www.tiktok.com", "m.tiktok.com", "vm.tiktok.com", "vt.tiktok.com"] },
  { platform: "instagram", hosts: ["instagram.com", "www.instagram.com", "instagr.am"] },
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
    throw new Error("Only TikTok, Instagram and YouTube URLs are supported");
  }
  return { url: url.href, platform };
}

function safeFilename(title, ext = "mp4") {
  const base = String(title || "video")
    .replace(/[^\w\s.-]+/g, "")
    .trim()
    .slice(0, 80) || "video";
  return `${base}.${ext}`;
}

function formatBytes(bytes) {
  const num = Number(bytes);
  return Number.isFinite(num) && num > 0 ? num : null;
}

// ---------- YouTube ----------

async function youtubeInfo(url) {
  const info = await ytdl.getInfo(url);
  const details = info.videoDetails;

  const videoFormats = info.formats
    .filter((f) => f.hasVideo && f.hasAudio && f.container === "mp4")
    .sort((a, b) => (b.height || 0) - (a.height || 0));

  const seen = new Set();
  const formats = [];
  for (const f of videoFormats) {
    const key = f.height || "sd";
    if (seen.has(key)) continue;
    seen.add(key);
    formats.push({
      id: f.itag.toString(),
      label: `${f.height || "SD"}p · MP4`,
      ext: "mp4",
      filesize: formatBytes(f.contentLength),
    });
    if (formats.length >= 5) break;
  }

  const audioOnly = info.formats
    .filter((f) => f.hasAudio && !f.hasVideo)
    .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];

  if (audioOnly) {
    formats.push({
      id: audioOnly.itag.toString(),
      label: "Audio only",
      ext: "m4a",
      filesize: formatBytes(audioOnly.contentLength),
    });
  }

  return {
    id: details.videoId,
    title: details.title,
    thumbnail: details.thumbnails?.at(-1)?.url || null,
    duration: Number(details.lengthSeconds) || null,
    uploader: details.author?.name || null,
    formats,
  };
}

function youtubeStream(url, formatId, res, title) {
  const stream = ytdl(url, {
    quality: formatId && formatId !== "best" ? formatId : "highest",
  });

  let started = false;
  stream.on("response", () => {
    started = true;
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename(title, "mp4")}"`);
  });
  stream.on("error", (err) => {
    if (!res.headersSent) {
      res.status(400).json({ error: err.message || "Download failed" });
    } else {
      res.end();
    }
  });
  stream.pipe(res);
}

// ---------- TikTok ----------

async function tiktokInfo(url) {
  const result = await TiktokDL.Downloader(url, { version: "v1" });
  if (result.status !== "success" || !result.result) {
    throw new Error(result.message || "Could not fetch TikTok video");
  }
  const data = result.result;
  const videoUrl = Array.isArray(data.video) ? data.video[0] : data.video;

  return {
    id: data.id || null,
    title: data.description || "TikTok video",
    thumbnail: data.cover || data.thumbnail || null,
    duration: null,
    uploader: data.author?.nickname || data.author?.username || null,
    formats: videoUrl
      ? [{ id: "tiktok-video", label: "Video · MP4", ext: "mp4", filesize: null }]
      : [],
    _videoUrl: videoUrl,
  };
}

// ---------- Instagram ----------

async function instagramInfo(url) {
  const data = await instagramGetUrl(url);
  if (!data.url_list || data.url_list.length === 0) {
    throw new Error("Could not fetch this Instagram post");
  }
  const media = data.media_details?.[0];
  const mediaUrl = data.url_list[0];
  const ext = media?.type === "image" ? "jpg" : "mp4";

  return {
    id: null,
    title: `${data.post_info?.owner_username || "instagram"} post`,
    thumbnail: media?.thumbnail || null,
    duration: null,
    uploader: data.post_info?.owner_username || null,
    formats: [{ id: "instagram-media", label: media?.type === "image" ? "Image" : "Video · MP4", ext, filesize: null }],
    _mediaUrl: mediaUrl,
    _ext: ext,
  };
}

// ---------- App ----------

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

    let info;
    if (platform === "youtube") info = await youtubeInfo(url);
    else if (platform === "tiktok") info = await tiktokInfo(url);
    else if (platform === "instagram") info = await instagramInfo(url);

    const { _videoUrl, _mediaUrl, _ext, ...publicInfo } = info;
    res.json({ platform, ...publicInfo });
  } catch (error) {
    const message = error?.message || "Could not fetch video info";
    res.status(400).json({ error: String(message).slice(0, 400) });
  }
});

app.get("/api/download", downloadLimiter, async (req, res) => {
  try {
    const { url, platform } = parsePublicUrl(req.query.url);
    const formatId = typeof req.query.format === "string" ? req.query.format : "";
    const title = typeof req.query.title === "string" ? req.query.title : "video";

    if (platform === "youtube") {
      youtubeStream(url, formatId, res, title);
      return;
    }

    if (platform === "tiktok") {
      const info = await tiktokInfo(url);
      if (!info._videoUrl) throw new Error("No downloadable video found");
      const upstream = await fetch(info._videoUrl);
      if (!upstream.ok || !upstream.body) throw new Error("Could not download TikTok video");
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Disposition", `attachment; filename="${safeFilename(title, "mp4")}"`);
      upstream.body.pipeTo(
        new WritableStream({
          write(chunk) {
            res.write(chunk);
          },
          close() {
            res.end();
          },
        })
      );
      return;
    }

    if (platform === "instagram") {
      const info = await instagramInfo(url);
      if (!info._mediaUrl) throw new Error("No downloadable media found");
      const upstream = await fetch(info._mediaUrl);
      if (!upstream.ok || !upstream.body) throw new Error("Could not download Instagram media");
      res.setHeader("Content-Type", info._ext === "jpg" ? "image/jpeg" : "video/mp4");
      res.setHeader("Content-Disposition", `attachment; filename="${safeFilename(title, info._ext)}"`);
      upstream.body.pipeTo(
        new WritableStream({
          write(chunk) {
            res.write(chunk);
          },
          close() {
            res.end();
          },
        })
      );
      return;
    }

    res.status(400).json({ error: "Unsupported platform" });
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({ error: error.message || "Download failed" });
    } else {
      res.end();
    }
  }
});

const publicDir = path.resolve(__dirname, "frontend/dist");
app.use(express.static(publicDir));
app.get(/^(?!\/api\/|\/health).*/, (req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile(path.join(publicDir, "index.html"), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`API ready on http://localhost:${PORT}`);
});