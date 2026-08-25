import { useEffect } from 'react'
import Downloader from '../components/Downloader.jsx'

export const Instagram = () => {
    useEffect(() => {
    document.title =
      'Instagram Downloader – Download Instagram Videos'

    const description =
      'Download supported Instagram videos by pasting a video URL.'

    let meta = document.querySelector(
      'meta[name="description"]'
    )

    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }

    meta.content = description
  }, [])

  return (
    <main className="bg-gray-50 px-6 py-20 dark:bg-zinc-950">

      <div className="mx-auto max-w-4xl text-center">

        <h1 className="text-4xl font-bold md:text-5xl">
          Instagram Video Downloader
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-gray-600 dark:text-zinc-400">
          Download supported Instagram videos by simply
          pasting the video URL below.
        </p>

        <Downloader platform="instagram" />

        <section className="mt-20 text-left">

          <h2 className="text-3xl font-bold">
            How to Download Instagram Videos
          </h2>

          <p className="mt-4 text-gray-600 dark:text-zinc-400">
            Copy the URL of a supported Instagram video,
            paste it into the downloader and select an
            available download option.
          </p>

          <h2 className="mt-12 text-3xl font-bold">
            Instagram Downloader FAQ
          </h2>

          <div className="mt-6 space-y-6">

            <div>
              <h3 className="font-bold">
                How do I download a Instagram video?
              </h3>

              <p className="mt-2 text-gray-600 dark:text-zinc-400">
                Copy the Instagram video URL and paste it
                into the downloader above.
              </p>
            </div>

            <div>
              <h3 className="font-bold">
                Can I use the downloader on my phone?
              </h3>

              <p className="mt-2 text-gray-600 dark:text-zinc-400">
                Yes. The page is designed for mobile
                and desktop browsers.
              </p>
            </div>

          </div>

        </section>

      </div>

    </main>
  )
}

