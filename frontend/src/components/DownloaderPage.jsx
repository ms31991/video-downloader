import Downloader from "./Downloader.jsx";
import { Seo } from "./Seo.jsx";
import { faqFor } from "../seo/pages.js";

export function DownloaderPage({ page, platform }) {
  const faqs = faqFor(page.id);
  const howLabel =
    page.id === "tiktok"
      ? "TikTok"
      : page.id === "instagram"
        ? "Instagram"
        : page.id === "youtube"
          ? "YouTube"
          : "social";

  return (
    <>
      <Seo page={page} />
      <main className="bg-gray-50 px-6 py-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold md:text-5xl">{page.h1}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-gray-600 dark:text-zinc-400">
            {page.intro}
          </p>

          <Downloader platform={platform} />

          <section className="mt-20 text-left">
            <h2 className="text-3xl font-bold">
              How to download {howLabel} videos
            </h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-gray-600 dark:text-zinc-400">
              <li>Open {howLabel} and copy the public video URL.</li>
              <li>Paste the link into the box above and start the download check.</li>
              <li>Choose a listed format and save the file to your device.</li>
            </ol>
            <p className="mt-4 text-gray-600 dark:text-zinc-400">
              Private, age-restricted or region-blocked videos cannot be fetched.
              Only download content you have the right to keep.
            </p>
          </section>

          <section className="mt-16 text-left">
            <h2 className="text-3xl font-bold">{howLabel} downloader FAQ</h2>
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
}
