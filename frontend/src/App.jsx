import { Routes, Route } from "react-router-dom";
import { TikTok } from "./pages/tiktok";
import { Instagram } from "./pages/instagram";
import { YouTube } from "./pages/youtube";
import { Home } from "./pages/Home";
import { Privacy, Terms, Dmca, NotFound } from "./pages/Legal";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tiktok-downloader" element={<TikTok />} />
        <Route path="/instagram-downloader" element={<Instagram />} />
        <Route path="/youtube-downloader" element={<YouTube />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/dmca" element={<Dmca />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
