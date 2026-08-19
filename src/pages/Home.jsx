export function Home({ url, setUrl, onSubmit, loading, error }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <section className="home">
      <div className="hero-badge">TikTok Downloader</div>
      <h1>Download TikTok Videos</h1>
      <p className="subtitle">
        Paste the video link and download as MP4 or MP3
      </p>

      <form className="url-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.84 4.84 0 0 1-1.01-.06z" />
          </svg>
          <input
            type="url"
            placeholder="https://www.tiktok.com/@user/video/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || !url.trim()}>
          {loading ? (
            <>
              <span className="spinner" />
              Loading...
            </>
          ) : (
            'Download'
          )}
        </button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      <div className="features">
        <div className="feature">
          <span className="feature-icon">🎬</span>
          <span>Normal (no watermark)</span>
        </div>
        <div className="feature">
          <span className="feature-icon">✨</span>
          <span>HD (with watermark)</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🎵</span>
          <span>MP3 Audio</span>
        </div>
      </div>
    </section>
  )
}
