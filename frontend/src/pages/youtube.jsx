import { DownloaderPage } from "../components/DownloaderPage.jsx";
import { pageByPath } from "../seo/pages.js";

export const YouTube = () => (
  <DownloaderPage page={pageByPath("/youtube-downloader")} platform="youtube" />
);
