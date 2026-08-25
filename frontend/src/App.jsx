import { Routes, Route, Navigate } from "react-router-dom";
import { TikTok } from "./pages/tiktok";
import { Instagram } from "./pages/instagram";
import { YouTube } from "./pages/youtube";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/tiktok-downloader" replace />} />
        <Route path="/tiktok-downloader" element={<TikTok />} />
        <Route path="/instagram-downloader" element={<Instagram />} />
        <Route path="/youtube-downloader" element={<YouTube />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
