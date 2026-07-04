#!/usr/bin/env node
// Run: node scripts/prerender.mjs
// Auto-runs after build via "postbuild" in package.json.
//
// This is a client-rendered SPA (no SSR), so useSeoMeta only sets the real
// per-page <title>/description/OG/JSON-LD after Vue mounts and runs its JS.
// Googlebot renders JS and sees it fine, but link-unfurlers for Twitter/X,
// LinkedIn, Facebook, Slack, and Discord generally don't execute JS — they
// only read the static HTML, so every shared link previewed as the generic
// homepage. This script writes a real dist/<route>/index.html per route with
// the correct meta already baked in. Vercel serves a matching static file
// before falling back to the vercel.json SPA rewrite, so no routing changes
// are needed — the JS bundle still mounts over this HTML exactly as before.

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parseFrontmatter } from '../src/lib/frontmatter.js'
import { HOME_META, JOURNAL_META, TIMELINE_META, postMeta, resolveMeta } from '../src/seo/routes.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '../dist')
const POSTS_DIR = join(__dirname, '../src/content/posts')

const posts = readdirSync(POSTS_DIR)
  .filter(f => f.endsWith('.md'))
  .map(f => parseFrontmatter(readFileSync(join(POSTS_DIR, f), 'utf8')).data)
  .filter(d => d.placeholder !== true && d.slug)
  .map(d => ({
    slug: d.slug,
    title: d.title || d.slug,
    excerpt: d.excerpt || '',
    date: d.date ? String(d.date).slice(0, 10) : '',
    tags: Array.isArray(d.tags) ? d.tags : [],
  }))

const routes = [
  { path: '/', meta: HOME_META },
  { path: '/journal', meta: JOURNAL_META },
  { path: '/timeline', meta: TIMELINE_META },
  ...posts.map(p => ({ path: `/journal/${p.slug}`, meta: postMeta(p) })),
]

const template = readFileSync(join(DIST, 'index.html'), 'utf8')

function setTag(html, matchRegex, tag) {
  return matchRegex.test(html) ? html.replace(matchRegex, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function renderHead(html, m) {
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${m.title}</title>`)
  html = setTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${m.description}" />`)
  html = setTag(html, /<meta name="robots"[^>]*>/, `<meta name="robots" content="index, follow" />`)
  html = setTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${m.url}" />`)

  html = setTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${m.title}" />`)
  html = setTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${m.description}" />`)
  html = setTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${m.url}" />`)
  html = setTag(html, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${m.type}" />`)
  if (m.image) {
    html = setTag(html, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${m.image}" />`)
    html = setTag(html, /<meta property="og:image:width"[^>]*>/, `<meta property="og:image:width" content="1200" />`)
    html = setTag(html, /<meta property="og:image:height"[^>]*>/, `<meta property="og:image:height" content="630" />`)
  }

  html = setTag(html, /<meta name="twitter:card"[^>]*>/, `<meta name="twitter:card" content="${m.image ? 'summary_large_image' : 'summary'}" />`)
  html = setTag(html, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${m.title}" />`)
  html = setTag(html, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${m.description}" />`)
  if (m.image) html = setTag(html, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${m.image}" />`)

  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/, '')
  if (m.jsonLd) {
    html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(m.jsonLd)}</script>\n  </head>`)
  }

  return html
}

for (const route of routes) {
  const m = resolveMeta(route.meta)
  if (!m) continue

  const html = renderHead(template, m)
  const outDir = route.path === '/' ? DIST : join(DIST, route.path)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
}

console.log(`prerendered ${routes.length} routes`)
