import { useState } from 'react'

function DownloadButton({ label, sublabel, icon, onClick, variant = 'default' }) {
  const [downloading, setDownloading] = useState(false)

  const handleClick = async () => {
    setDownloading(true)
    try {
      await onClick()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      className={`btn btn-download btn-${variant}`}
      onClick={handleClick}
      disabled={downloading}
    >
      <span className="btn-icon">{icon}</span>
      <span className="btn-text">
        <span className="btn-label">{downloading ? 'Downloading...' : label}</span>
        {sublabel && <span className="btn-sublabel">{sublabel}</span>}
      </span>
      {downloading && <span className="spinner spinner-sm" />}
    </button>
  )
}

export function Card({ video, onNewVideo }) {
  const triggerDownload = async (type, label) => {
    const url = video.downloads[type]
    if (!url) {
      alert('This format is not available for this video.')
      return
    }

    const params = new URLSearchParams({
      url,
      filename: video.title.slice(0, 50),
      type: type === 'mp3' ? 'mp3' : 'mp4',
    })

    const response = await fetch(`/api/download?${params}`)
    if (!response.ok) {
      alert('Download failed. Please try again.')
      return
    }

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `${video.title.slice(0, 50)}.${type === 'mp3' ? 'mp3' : 'mp4'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  }

  return (
    <section className="card">
      <div className="video-preview">
        <img src={video.cover} alt={video.title} />
        <div className="video-overlay">
          <svg viewBox="0 0 24 24" fill="white" width="48" height="48">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <div className="video-info">
        <h2>{video.title}</h2>
        <p className="author">@{video.author}</p>
        {video.duration && (
          <p className="duration">{Math.floor(video.duration)}s</p>
        )}
      </div>

      <div className="download-options">
        <h3>Choose download format</h3>

        <DownloadButton
          label="Download Normal"
          sublabel="No watermark"
          icon="📱"
          variant="normal"
          onClick={() => triggerDownload('normal', 'normal')}
        />

        <DownloadButton
          label="Download HD"
          sublabel="With watermark / ads"
          icon="🎥"
          variant="hd"
          onClick={() => triggerDownload('hd', 'hd')}
        />

        <DownloadButton
          label="Download MP3"
          sublabel="Audio only"
          icon="🎵"
          variant="mp3"
          onClick={() => triggerDownload('mp3', 'mp3')}
        />
      </div>

      <button className="btn btn-new" onClick={onNewVideo}>
        + New Video
      </button>
    </section>
  )
}
