import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "";

function platformFromUrl(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes("tiktok")) return "tiktok";
    if (host.includes("instagram") || host.includes("instagr.am")) return "instagram";
    if (host.includes("youtube") || host.includes("youtu.be")) return "youtube";
    if (host.includes("facebook") || host.includes("fb.watch") || host.includes("fb.me")) {
      return "facebook";
    }
  } catch {
    return null;
  }
  return null;
}

function formatSize(bytes) {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default function Downloader({ platform = "all" }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const value = url.trim();
    setError("");
    setInfo(null);

    if (!value) {
      setError("Paste a video URL first.");
      return;
    }

    const detected = platformFromUrl(value);
    if (!detected) {
      setError("Use a TikTok, Instagram, YouTube or Facebook URL.");
      return;
    }

    if (platform !== "all" && detected !== platform) {
      setError(`This page only accepts ${platform} URLs.`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not fetch this video.");
      }
      setInfo(data);
    } catch (err) {
      setError(err.message || "Backend is not reachable.");
    } finally {
      setLoading(false);
    }
  }

  function downloadUrl(formatId) {
    const params = new URLSearchParams({
      url,
      format: formatId,
      title: info?.title || "video",
    });
    return `${API_BASE}/api/download?${params.toString()}`;
  }

  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow dark:border dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none md:flex-row"
      >
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={
            platform === "all"
              ? "Paste video URL here..."
              : `Paste ${platform} URL here...`
          }
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-7 py-3 font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {loading ? "Checking..." : "Download"}
        </button>
      </form>

      {error ? (
        <p className="mt-4 text-left text-sm text-red-600">{error}</p>
      ) : null}

      {info ? (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          <div className="flex gap-4">
            {info.thumbnail ? (
              <img
                src={info.thumbnail}
                alt=""
                className="h-24 w-40 rounded-lg object-cover"
              />
            ) : null}
            <div>
              <h3 className="font-semibold">{info.title}</h3>
              {info.uploader ? (
                <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">{info.uploader}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {info.formats.map((format) => (
              <a
                key={format.id}
                href={downloadUrl(format.id)}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <span className="font-medium">{format.label}</span>
                <span className="text-sm text-gray-500 dark:text-zinc-400">
                  {formatSize(format.filesize) || "Save file"}
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
