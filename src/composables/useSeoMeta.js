import { watchEffect } from 'vue'

const SITE_NAME = 'Ghaly Rizqi Mauludin'
export const SITE_URL = 'https://ghaly.vercel.app'

const DEFAULT_DESC = 'Data engineer in Jakarta. Four years building pipelines and migrating warehouses.'

export function useSeoMeta(getMeta) {
  watchEffect(() => {
    const m = typeof getMeta === 'function' ? getMeta() : getMeta
    if (!m) return

    const title       = m.title ? `${m.title} — ${SITE_NAME}` : `${SITE_NAME} — Data Engineer`
    const description = m.description || DEFAULT_DESC
    const url         = m.url || SITE_URL
    const image       = m.image || null
    const type        = m.type || 'website'

    document.title = title

    setMeta('name',     'description',       description)
    setMeta('name',     'robots',            'index, follow')

    setMeta('property', 'og:site_name',  SITE_NAME)
    setMeta('property', 'og:title',      title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url',        url)
    setMeta('property', 'og:type',       type)
    if (image) setMeta('property', 'og:image', image)

    setMeta('name', 'twitter:card',        image ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title',       title)
    setMeta('name', 'twitter:description', description)
    if (image) setMeta('name', 'twitter:image', image)

    setCanonical(url)
    if (m.jsonLd) setJsonLd(m.jsonLd)
  })
}

function setMeta(attr, key, content) {
  if (content == null) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

function setJsonLd(data) {
  let el = document.querySelector('script[type="application/ld+json"]')
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}