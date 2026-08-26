import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { seoPrerenderPlugin } from './vite-plugin-seo.js'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), seoPrerenderPlugin(env.VITE_SITE_URL || '')],
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:4000',
        '/health': 'http://127.0.0.1:4000',
      },
    },
  }
})
