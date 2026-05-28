// Load all .md files as raw strings
const rawFiles = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default', eager: true })

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw.trim() }

  const data = {}
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':')
    if (colon === -1) return
    const key = line.slice(0, colon).trim()
    let val = line.slice(colon + 1).trim()

    if (val.startsWith('[') && val.endsWith(']')) {
      // Array: [a, b, c]  or  [a, "b c", d]
      val = val.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
    } else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    } else if (val === 'true') {
      val = true
    } else if (val === 'false') {
      val = false
    } else if (!isNaN(val) && val !== '') {
      val = Number(val)
    }
    data[key] = val
  })

  return { data, content: match[2].trim() }
}

function readingTime(text) {
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 200))
}

export const POSTS = Object.entries(rawFiles)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    const slug = data.slug || path.split('/').pop().replace(/\.md$/, '')
    return {
      slug,
      title:       data.title       || slug,
      excerpt:     data.excerpt     || '',
      date:        data.date        ? String(data.date).slice(0, 10) : '',
      minutes:     data.minutes     || readingTime(content),
      tags:        Array.isArray(data.tags) ? data.tags : [],
      placeholder: data.placeholder || false,
      content,
    }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export function getPost(slug) {
  return POSTS.find(p => p.slug === slug) || null
}
