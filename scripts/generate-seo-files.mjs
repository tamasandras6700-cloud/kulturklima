import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const siteUrl = (
  process.env.VITE_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'https://kulturklima.vercel.app'
).replace(/\/$/, '')

const lastmod = new Date().toISOString().slice(0, 10)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

writeFileSync(resolve('public', 'sitemap.xml'), sitemap, 'utf8')
writeFileSync(resolve('public', 'robots.txt'), robots, 'utf8')
console.log(`Generated SEO files for ${siteUrl}`)
