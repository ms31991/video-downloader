import { DownloaderPage } from "../components/DownloaderPage.jsx";
import { pageByPath } from "../seo/pages.js";

export const Instagram = () => (
  <DownloaderPage
    page={pageByPath("/instagram-downloader")}
    platform="instagram"
  />
);
