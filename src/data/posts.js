import { parseFrontmatter, readingTime } from '../lib/frontmatter.js'

// Load all .md files as raw strings
const rawFiles = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default', eager: true })

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
