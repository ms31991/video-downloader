export const metadata = {
  title: "TikTok Downloader – Download TikTok Videos",
  description:
    "Download supported TikTok videos by pasting the video URL into our TikTok downloader.",
};

export default function TikTokDownloader() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-20">

      <div className="mx-auto max-w-4xl">

        <div className="text-center">

          <h1 className="text-5xl font-bold">
            TikTok Video Downloader
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Download supported TikTok videos by
            pasting the video URL below.
          </p>


          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-xl bg-white p-3 shadow md:flex-row">

            <input
              type="text"
              placeholder="Paste TikTok video URL..."
              className="flex-1 rounded-lg border px-4 py-3"
            />

            <button className="rounded-lg bg-black px-8 py-3 font-semibold text-white">
              Download
            </button>

          </div>

        </div>


        <section className="mt-20">

          <h2 className="text-3xl font-bold">
            How to Download TikTok Videos
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Copy the URL of a supported TikTok video,
            paste it into the downloader above and select
            an available download option.
          </p>

        </section>


        <section className="mt-16">

          <h2 className="text-3xl font-bold">
            TikTok Downloader FAQ
          </h2>


          <div className="mt-8 space-y-8">

            <div>

              <h3 className="text-lg font-bold">
                How do I download a TikTok video?
              </h3>

              <p className="mt-2 text-gray-600">
                Copy the URL of a supported TikTok video,
                paste it into the downloader and click
                Download.
              </p>

            </div>


            <div>

              <h3 className="text-lg font-bold">
                Can I use the TikTok downloader on my phone?
              </h3>

              <p className="mt-2 text-gray-600">
                Yes. The website is designed to work on
                mobile phones, tablets and desktop computers.
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}