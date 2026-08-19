import { useState } from 'react'
import './App.css'
import { Home } from './pages/Home'
import { Card } from './pages/Card'

function App() {
  const [url, setUrl] = useState('')
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!url.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Unknown error.')
        return
      }

      setVideo(data)
    } catch {
      setError('Could not connect to server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewVideo = () => {
    setVideo(null)
    setUrl('')
    setError('')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.84 4.84 0 0 1-1.01-.06z" />
          </svg>
          <span>Video Downloader</span>
        </div>
      </header>

      <main className="main">
        {!video ? (
          <Home
            url={url}
            setUrl={setUrl}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        ) : (
          <Card video={video} onNewVideo={handleNewVideo} />
        )}
      </main>

      <footer className="footer">
        <p>Download TikTok videos for free — no sign-up required</p>
      </footer>
    </div>
  )
}

export default App
