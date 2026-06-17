import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function resolveSiteUrl(): string {
  return (
    process.env.VITE_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'https://kulturklima.vercel.app'
  ).replace(/\/$/, '')
}

function seoHtmlPlugin(): Plugin {
  return {
    name: 'kulturklima-seo-html',
    transformIndexHtml(html) {
      const siteUrl = resolveSiteUrl()
      return html
        .replace(
          '<meta property="og:image" content="/favicon.svg" />',
          `<meta property="og:image" content="${siteUrl}/favicon.svg" />
    <meta property="og:url" content="${siteUrl}/" />
    <link rel="canonical" href="${siteUrl}/" />`,
        )
        .replace(
          '<meta name="twitter:image" content="/favicon.svg" />',
          `<meta name="twitter:image" content="${siteUrl}/favicon.svg" />`,
        )
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoHtmlPlugin()],
  server: {
    proxy: {
      '/api/statbank': {
        target: 'https://api.statbank.dk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/statbank/, ''),
      },
    },
  },
  preview: {
    proxy: {
      '/api/statbank': {
        target: 'https://api.statbank.dk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/statbank/, ''),
      },
    },
  },
})
