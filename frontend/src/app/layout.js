import "./globals.css";

export const metadata = {
  title: "Video Downloader – TikTok, Instagram & More",
  description:
    "Download videos from supported social media platforms by simply pasting the video URL.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}