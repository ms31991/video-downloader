import { Link } from "react-router-dom";
import Downloader from "../components/Downloader.jsx";
import { Seo } from "../components/Seo.jsx";
import { faqFor, pageByPath } from "../seo/pages.js";

export const Home = () => {
  const page = pageByPath("/");
  const faqs = faqFor("home");

  return (
    <>
      <Seo page={page} />
      <main className="bg-gray-50 px-6 py-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold md:text-5xl">{page.h1}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-gray-600 dark:text-zinc-400">
            {page.intro}
          </p>

          <Downloader platform="all" />

          <nav className="mt-10 flex flex-wrap justify-center gap-3 text-sm font-medium">
            <Link
              to="/tiktok-downloader"
              className="rounded-full border border-gray-200 px-4 py-2 hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              TikTok downloader
            </Link>
            <Link
              to="/instagram-downloader"
              className="rounded-full border border-gray-200 px-4 py-2 hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Instagram downloader
            </Link>
            <Link
              to="/youtube-downloader"
              className="rounded-full border border-gray-200 px-4 py-2 hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              YouTube downloader
            </Link>
          </nav>

          <section className="mt-20 text-left">
            <h2 className="text-3xl font-bold">How ClipSnap works</h2>
            <p className="mt-4 text-gray-600 dark:text-zinc-400">
              Copy a public video link from TikTok, Instagram or YouTube, paste
              it above, then choose a format. Files download through your
              browser. No desktop app and no account are required.
            </p>
          </section>

          <section className="mt-16 text-left">
            <h2 className="text-3xl font-bold">Video downloader FAQ</h2>
            <div className="mt-6 space-y-6">
              {faqs.map((item) => (
                <div key={item.q}>
                  <h3 className="font-bold">{item.q}</h3>
                  <p className="mt-2 text-gray-600 dark:text-zinc-400">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
