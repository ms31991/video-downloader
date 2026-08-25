export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="flex items-center gap-2.5 text-lg font-bold">
              <img
                src="/logo.png"
                alt=""
                className="h-9 w-9 rounded-full object-cover"
              />
              VideoDownloader
            </h3>

            <p className="mt-3 text-sm text-gray-500 dark:text-zinc-400">
              A simple video downloader for supported platforms.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Platforms
            </h3>

            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a
                href="/tiktok-downloader"
                className="hover:underline"
              >
                TikTok Downloader
              </a>

              <a
                href="/instagram-downloader"
                className="hover:underline"
              >
                Instagram Downloader
              </a>

              <a
                href="/youtube-downloader"
                className="hover:underline"
              >
                YouTube Downloader
              </a>

            </div>
          </div>

          <div>
            <h3 className="font-semibold">
              Legal
            </h3>

            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>

              <a href="/terms" className="hover:underline">
                Terms of Service
              </a>

              <a href="/dmca" className="hover:underline">
                DMCA
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500 dark:border-zinc-800 dark:text-zinc-400">
          © 2026 VideoDownloader. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
