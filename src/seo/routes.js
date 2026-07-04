// Single source of truth for per-route SEO metadata. Consumed by the Vue
// pages (via useSeoMeta) and by scripts/prerender.mjs (plain Node, no Vite/
// Vue APIs) so the two never drift out of sync.

export const SITE_URL = 'https://ghaly.vercel.app'
export const SITE_NAME = 'Ghaly Rizqi Mauludin'
export const OG_IMAGE = `${SITE_URL}/og-image.png`
export const DEFAULT_DESC = 'Data engineer in Jakarta. Four years building pipelines and migrating warehouses.'

// Turns a page's partial meta object into the fully-resolved set of values
// every consumer (useSeoMeta at runtime, scripts/prerender.mjs at build
// time) needs to write out — kept here so both stay in sync.
export function resolveMeta(m) {
  if (!m) return null
  return {
    title:       m.title ? `${m.title} — ${SITE_NAME}` : `${SITE_NAME} — Data Engineer`,
    description: m.description || DEFAULT_DESC,
    url:         m.url || SITE_URL,
    image:       m.image || OG_IMAGE,
    type:        m.type || 'website',
    jsonLd:      m.jsonLd || null,
  }
}

const PERSON = { '@type': 'Person', name: SITE_NAME, url: SITE_URL }

export const HOME_META = {
  title: null,
  description: "Builds data pipelines on weekdays. Checks if they're still running on weekends. Upgraded two Airflow instances before IT Support could hand back the ThinkPad.",
  url: SITE_URL,
  image: OG_IMAGE,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_NAME,
    jobTitle: 'Data Engineer',
    url: SITE_URL,
    email: 'ghalyrizqimauludin@gmail.com',
    sameAs: ['https://linkedin.com/in/ghalyrizqi'],
    image: OG_IMAGE,
  },
}

export const JOURNAL_META = {
  title: 'The Second Brain',
  description: 'Notes on data engineering, infrastructure, and tools. Written by Ghaly Rizqi Mauludin.',
  url: `${SITE_URL}/journal`,
  image: OG_IMAGE,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The Second Brain',
    description: 'Notes on data engineering, infrastructure, and tools.',
    url: `${SITE_URL}/journal`,
    author: PERSON,
    inLanguage: 'en',
  },
}

export const TIMELINE_META = {
  title: 'Career Archive',
  description: 'Every job and detour since 2019. Data engineering across Jakarta and Surabaya.',
  url: `${SITE_URL}/timeline`,
  image: OG_IMAGE,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: 'Career Archive — Ghaly Rizqi Mauludin',
    description: 'Every job and detour since 2019.',
    url: `${SITE_URL}/timeline`,
    mainEntity: { '@type': 'Person', name: SITE_NAME, jobTitle: 'Data Engineer', url: SITE_URL },
  },
}

export function postMeta(post) {
  if (!post) return null
  const url = `${SITE_URL}/journal/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt,
    url,
    type: 'article',
    image: OG_IMAGE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      author: PERSON,
      publisher: PERSON,
      datePublished: post.date,
      dateModified: post.date,
      url,
      inLanguage: 'en',
      keywords: (post.tags || []).join(', '),
      image: OG_IMAGE,
    },
  }
}
