import { ref, watch, toValue } from 'vue'
import { useTheme } from './useTheme.js'

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
const MAX_BATCH = 30 // Unsplash's cap for the `count` param on /photos/random
const BACKOFF_KEY = 'unsplash-backoff-until'
const BACKOFF_MS = 10 * 60 * 1000 // Unsplash's rate limit is shared across the whole key, so once we hit it, don't spend more of its recovery window on requests that will just fail too.
const REROLL_WINDOW_KEY = 'unsplash-reroll-window'
const REROLL_MAX = 15 // manual rerolls allowed per window — most requests are served from the pool for free, so this mainly guards against one visitor rapid-clicking the shared pool empty
const REROLL_WINDOW_MS = 60 * 60 * 1000
const POOL_MAX = MAX_BATCH * 3 // reserve cap per theme; a ceiling, not a target — refills happen lazily in single MAX_BATCH-sized requests, so this is rarely fully hit

const QUERIES = {
  dark: 'flowers black background',
  light: 'flowers white background',
}

function cacheKey(slug, themeName) {
  return `photo:${slug}:${themeName}`
}

function readCache(slug, themeName) {
  const raw = localStorage.getItem(cacheKey(slug, themeName))
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeCache(slug, themeName, photo) {
  localStorage.setItem(cacheKey(slug, themeName), JSON.stringify(photo))
}

function poolKey(themeName) {
  return `photo-pool:${themeName}`
}

function readPool(themeName) {
  const raw = localStorage.getItem(poolKey(themeName))
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writePool(themeName, pool) {
  localStorage.setItem(poolKey(themeName), JSON.stringify(pool.slice(0, POOL_MAX)))
}

// A pre-fetched reserve of photos per theme. Popping from it costs zero
// network calls, so new slugs and rerolls draw from here before ever
// touching the network — see pushToPool, and the pool check in load().
function popFromPool(themeName) {
  const pool = readPool(themeName)
  if (!pool.length) return null
  const photo = pool.pop()
  writePool(themeName, pool)
  return photo
}

function pushToPool(themeName, photos) {
  if (!photos.length) return
  writePool(themeName, [...readPool(themeName), ...photos])
}

function pingDownload(downloadLocation) {
  if (!downloadLocation) return
  fetch(`${downloadLocation}${downloadLocation.includes('?') ? '&' : '?'}client_id=${ACCESS_KEY}`).catch(() => {})
}

function isBackingOff() {
  return Date.now() < Number(localStorage.getItem(BACKOFF_KEY) || 0)
}

function startBackoff() {
  localStorage.setItem(BACKOFF_KEY, String(Date.now() + BACKOFF_MS))
}

function readRerollWindow() {
  const now = Date.now()
  const raw = localStorage.getItem(REROLL_WINDOW_KEY)
  const state = raw ? JSON.parse(raw) : null
  if (!state || now - state.windowStart > REROLL_WINDOW_MS) {
    return { windowStart: now, count: 0 }
  }
  return state
}

// Manual rerolls are a much easier way to drain the shared pool/quota than
// organic page loads (nothing stops someone from clicking rapidly), so they
// get their own budget on top of the general backoff.
function canReroll() {
  return readRerollWindow().count < REROLL_MAX
}

function recordReroll() {
  const state = readRerollWindow()
  state.count += 1
  localStorage.setItem(REROLL_WINDOW_KEY, JSON.stringify(state))
}

class RateLimitError extends Error {}

function toPhoto(d) {
  return {
    url: d.urls.regular,
    name: d.user.name,
    profileUrl: d.user.links.html,
    downloadLocation: d.links.download_location,
  }
}

async function fetchRandomPhotos(query, count) {
  const countParam = count > 1 ? `&count=${Math.min(count, MAX_BATCH)}` : ''
  const res = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape${countParam}`,
    { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
  )
  if (res.status === 403) throw new RateLimitError('Unsplash rate limit exceeded')
  if (!res.ok) throw new Error(`Unsplash request failed: ${res.status}`)
  const data = await res.json()
  return (Array.isArray(data) ? data : [data]).map(toPhoto)
}

// Every PostPhoto instance wants "a random photo for this theme's query" at
// mount time. Several mount in the same tick (a page can have a dozen cards),
// and Unsplash's demo-tier rate limit (50 req/hour) can't absorb that many
// separate requests. Instead, collect everyone asking for the same theme
// within a tick and serve them all from a single /photos/random?count=N call.
const batchQueues = new Map() // themeName -> [{ resolve, reject }]

function queuePhotoFetch(themeName) {
  return new Promise((resolve, reject) => {
    if (!batchQueues.has(themeName)) {
      batchQueues.set(themeName, [])
      setTimeout(() => flushBatch(themeName), 0)
    }
    batchQueues.get(themeName).push({ resolve, reject })
  })
}

async function flushBatch(themeName) {
  const waiters = batchQueues.get(themeName) ?? []
  batchQueues.delete(themeName)
  if (!waiters.length) return
  try {
    // Always ask for a full batch regardless of how many are actually
    // waiting — one HTTP call costs the same whether count is 3 or 30, so
    // the surplus gets banked into the pool for future loads/rerolls to
    // draw on for free instead of hitting the network again.
    const photos = await fetchRandomPhotos(QUERIES[themeName], MAX_BATCH)
    waiters.forEach((w, i) => w.resolve(photos[i]))
    pushToPool(themeName, photos.slice(waiters.length))
  } catch (err) {
    if (err instanceof RateLimitError) startBackoff()
    waiters.forEach((w) => w.reject(err))
  }
}

export function usePostPhoto(slugSource) {
  const { theme } = useTheme()
  const currentSlug = () => toValue(slugSource)
  const photo = ref(readCache(currentSlug(), theme.value))
  const error = ref(false)
  const rerollLimited = ref(!canReroll())

  async function load(themeName, { force = false, retried = false } = {}) {
    const slug = currentSlug()
    if (!force) {
      photo.value = readCache(slug, themeName)
      if (photo.value) {
        error.value = false
        return
      }
    }
    // Pool hit costs no network call — check it before the backoff gate, so a
    // never-seen slug still gets a real photo even mid-backoff, as long as
    // the pool has stock.
    const pooled = popFromPool(themeName)
    if (pooled) {
      writeCache(slug, themeName, pooled)
      pingDownload(pooled.downloadLocation)
      if (theme.value === themeName && currentSlug() === slug) {
        photo.value = pooled
        error.value = false
      }
      return
    }
    if (isBackingOff()) {
      error.value = true
      return
    }
    try {
      const fresh = await queuePhotoFetch(themeName)
      writeCache(slug, themeName, fresh)
      pingDownload(fresh.downloadLocation)
      if (theme.value === themeName && currentSlug() === slug) {
        photo.value = fresh
        error.value = false
      }
    } catch {
      // Transient failures (e.g. hitting Unsplash's rate limit) are common when
      // several photos load at once — retry once before surfacing an error.
      if (!retried) {
        setTimeout(() => load(themeName, { force: true, retried: true }), 2000)
        return
      }
      if (theme.value === themeName && currentSlug() === slug) error.value = true
    }
  }

  load(theme.value)
  watch([theme, currentSlug], ([themeName]) => load(themeName))

  function reroll() {
    if (!canReroll()) {
      rerollLimited.value = true
      return
    }
    recordReroll()
    rerollLimited.value = !canReroll()
    load(theme.value, { force: true })
  }

  return { photo, error, rerollLimited, reroll }
}
