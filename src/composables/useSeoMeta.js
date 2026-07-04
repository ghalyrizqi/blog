import { watchEffect } from 'vue'
import { SITE_URL, SITE_NAME, resolveMeta } from '../seo/routes.js'

export { SITE_URL }

export function useSeoMeta(getMeta) {
  watchEffect(() => {
    const raw = typeof getMeta === 'function' ? getMeta() : getMeta
    const m = resolveMeta(raw)
    if (!m) return

    document.title = m.title

    setMeta('name', 'description', m.description)
    setMeta('name', 'robots',     'index, follow')
    setMeta('name', 'author',     'Ghaly Rizqi Mauludin')

    setMeta('property', 'og:locale',     'en_US')
    setMeta('property', 'og:site_name',  SITE_NAME)
    setMeta('property', 'og:title',      m.title)
    setMeta('property', 'og:description', m.description)
    setMeta('property', 'og:url',        m.url)
    setMeta('property', 'og:type',       m.type)
    if (m.image) {
      setMeta('property', 'og:image',        m.image)
      setMeta('property', 'og:image:width',  '1200')
      setMeta('property', 'og:image:height', '630')
    }

    setMeta('name', 'twitter:card',        m.image ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title',       m.title)
    setMeta('name', 'twitter:description', m.description)
    if (m.image) setMeta('name', 'twitter:image', m.image)

    setCanonical(m.url)
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