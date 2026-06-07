#!/usr/bin/env node
// Run: node scripts/generate-sitemap.js
// Auto-runs before build via "prebuild" in package.json

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'https://ghaly.vercel.app'
const POSTS_DIR = join(__dirname, '../src/content/posts')
const OUT = join(__dirname, '../public/sitemap.xml')
const TODAY = new Date().toISOString().slice(0, 10)

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const data = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    data[key] = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
  }
  return data
}

const posts = readdirSync(POSTS_DIR)
  .filter(f => f.endsWith('.md'))
  .map(f => parseFrontmatter(readFileSync(join(POSTS_DIR, f), 'utf8')))
  .filter(d => d.placeholder !== 'true' && d.placeholder !== true && d.slug)
  .map(d => ({ slug: d.slug, date: d.date ? String(d.date).slice(0, 10) : TODAY }))

const urls = [
  { loc: `${SITE_URL}/`,         lastmod: TODAY, changefreq: 'monthly', priority: '1.0' },
  { loc: `${SITE_URL}/blog`,     lastmod: TODAY, changefreq: 'weekly',  priority: '0.9' },
  { loc: `${SITE_URL}/timeline`, lastmod: TODAY, changefreq: 'monthly', priority: '0.8' },
  ...posts.map(p => ({
    loc: `${SITE_URL}/blog/${p.slug}`,
    lastmod: p.date,
    changefreq: 'monthly',
    priority: '0.7',
  })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

writeFileSync(OUT, xml)
console.log(`sitemap.xml — ${urls.length} URLs`)
