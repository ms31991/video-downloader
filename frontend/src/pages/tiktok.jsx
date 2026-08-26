import { DownloaderPage } from "../components/DownloaderPage.jsx";
import { pageByPath } from "../seo/pages.js";

export const TikTok = () => (
  <DownloaderPage page={pageByPath("/tiktok-downloader")} platform="tiktok" />
);
