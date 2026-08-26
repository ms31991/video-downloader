import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2.5 text-lg font-bold">
              <img
                src="/logo.png"
                alt="ClipSnap"
                className="h-9 w-9 rounded-full object-cover"
              />
              ClipSnap
            </Link>

            <p className="mt-3 text-sm text-gray-500 dark:text-zinc-400">
              Free online video downloader for TikTok, Instagram and YouTube.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Platforms
            </h3>

            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link
                to="/tiktok-downloader"
                className="hover:underline"
              >
                TikTok Downloader
              </Link>

              <Link
                to="/instagram-downloader"
                className="hover:underline"
              >
                Instagram Downloader
              </Link>

              <Link
                to="/youtube-downloader"
                className="hover:underline"
              >
                YouTube Downloader
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">
              Legal
            </h3>

            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link
                to="/privacy"
                className="hover:underline"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="hover:underline"
              >
                Terms of Service
              </Link>

              <Link
                to="/dmca"
                className="hover:underline"
              >
                DMCA
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500 dark:border-zinc-800 dark:text-zinc-400">
          © 2026 ClipSnap. All rights reserved.
        </div>
      </div>
    </footer>
  );
};