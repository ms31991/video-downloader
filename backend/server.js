import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

function isValidTikTokUrl(url) {
  return /(?:tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)/i.test(url)
}

app.post('/api/fetch', async (req, res) => {
  const { url } = req.body

  if (!url || !isValidTikTokUrl(url)) {
    return res.status(400).json({ error: 'Please enter a valid TikTok link.' })
  }

  try {
    const response = await fetch(
      `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    )

    const data = await response.json()

    if (data.code !== 0 || !data.data) {
      return res.status(400).json({ error: 'Video not found. Please check the link.' })
    }

    const video = data.data

    res.json({
      id: video.id,
      title: video.title || 'TikTok Video',
      author: video.author?.nickname || video.author?.unique_id || 'Unknown',
      cover: video.cover || video.origin_cover,
      duration: video.duration,
      downloads: {
        normal: video.play,
        hd: video.hdplay || video.wmplay || video.play,
        mp3: video.music,
      },
    })
  } catch (err) {
    console.error('Fetch error:', err)
    res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

app.get('/api/download', async (req, res) => {
  const { url, filename, type } = req.query

  if (!url) {
    return res.status(400).json({ error: 'URL is missing.' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://www.tiktok.com/',
      },
    })

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to download video.' })
    }

    const contentType =
      type === 'mp3'
        ? 'audio/mpeg'
        : response.headers.get('content-type') || 'video/mp4'

    const safeName = (filename || 'tiktok-video').replace(/[^\w\s-]/g, '').trim()
    const ext = type === 'mp3' ? 'mp3' : 'mp4'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.${ext}"`)

    const buffer = Buffer.from(await response.arrayBuffer())
    res.send(buffer)
  } catch (err) {
    console.error('Download error:', err)
    res.status(500).json({ error: 'Download error. Please try again.' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
