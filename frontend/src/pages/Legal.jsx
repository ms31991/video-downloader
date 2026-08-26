import { Link } from "react-router-dom";
import { Seo } from "../components/Seo.jsx";
import { pageByPath } from "../seo/pages.js";

export function Privacy() {
  const page = pageByPath("/privacy");
  return (
    <>
      <Seo page={page} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-gray-600 dark:text-zinc-400">Last updated: August 26, 2026</p>
        <div className="mt-8 space-y-4 text-gray-700 dark:text-zinc-300">
          <p>
            ClipSnap is an online video downloader. When you paste a URL, that
            address is sent to our server so we can look up available public
            formats. We do not ask you to create an account.
          </p>
          <h2 className="pt-4 text-2xl font-semibold">What we process</h2>
          <p>
            Video URLs you submit, basic request metadata (such as IP address
            and browser type) used for security and rate limiting, and optional
            theme preference stored in your browser via localStorage.
          </p>
          <h2 className="pt-4 text-2xl font-semibold">Cookies</h2>
          <p>
            We do not use advertising cookies. Your device may store a theme
            setting locally so dark or light mode persists.
          </p>
          <h2 className="pt-4 text-2xl font-semibold">Contact</h2>
          <p>
            For privacy questions, use the contact details you publish on this
            site or your hosting account.
          </p>
        </div>
      </main>
    </>
  );
}

export function Terms() {
  const page = pageByPath("/terms");
  return (
    <>
      <Seo page={page} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="mt-4 text-gray-600 dark:text-zinc-400">Last updated: August 26, 2026</p>
        <div className="mt-8 space-y-4 text-gray-700 dark:text-zinc-300">
          <p>
            ClipSnap is provided as-is for personal use. You may only download
            videos you own or have permission to save. You must follow TikTok,
            Instagram, YouTube and Facebook terms, as well as copyright law.
          </p>
          <p>
            We do not host user video libraries. Fetching can fail for private,
            deleted or restricted links. Service availability is not guaranteed.
          </p>
          <p>
            Do not use ClipSnap to infringe rights, bypass paid access, or
            attack the service (including scraping abuse and automated overload).
          </p>
        </div>
      </main>
    </>
  );
}

export function Dmca() {
  const page = pageByPath("/dmca");
  return (
    <>
      <Seo page={page} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold">DMCA Policy</h1>
        <p className="mt-4 text-gray-600 dark:text-zinc-400">Last updated: August 26, 2026</p>
        <div className="mt-8 space-y-4 text-gray-700 dark:text-zinc-300">
          <p>
            ClipSnap respects copyright. We do not want this tool used to steal
            other people’s work. If you are a rights holder and believe material
            was processed in a way that infringes your rights, send a DMCA
            notice with:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Your contact information</li>
            <li>A description of the copyrighted work</li>
            <li>The URL or video link involved</li>
            <li>A good-faith statement and your signature</li>
          </ul>
          <p>
            We will review valid notices and may block further processing of
            the reported URL where required by law.
          </p>
        </div>
      </main>
    </>
  );
}

export function NotFound() {
  const page = {
    id: "404",
    path: "/404",
    title: "Page not found | ClipSnap",
    description: "This ClipSnap page does not exist.",
    noindex: true,
  };
  return (
    <>
      <Seo page={page} />
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-gray-600 dark:text-zinc-400">
          The page you requested is not available. Try the home downloader
          instead.
        </p>
        <Link to="/" className="mt-8 inline-block font-semibold underline">
          Go to ClipSnap home
        </Link>
      </main>
    </>
  );
}
