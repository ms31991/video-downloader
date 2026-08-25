import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="VideoDownloader"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="text-xl font-bold">VideoDownloader</span>
        </Link>

        <div className="flex items-center gap-3 text-sm md:gap-5 md:text-base">
          <Link
            to="/tiktok-downloader"
            className="hover:text-gray-600 dark:hover:text-zinc-300"
          >
            TikTok
          </Link>
          <Link
            to="/instagram-downloader"
            className="hover:text-gray-600 dark:hover:text-zinc-300"
          >
            Instagram
          </Link>
          <Link
            to="/youtube-downloader"
            className="hover:text-gray-600 dark:hover:text-zinc-300"
          >
            YouTube
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            {isDark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M21 14.3A9 9 0 1 1 9.7 3a7 7 0 0 0 11.3 11.3z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
