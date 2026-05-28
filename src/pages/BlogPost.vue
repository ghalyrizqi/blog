<template>
  <div class="page">
    <ReadingProgress />

    <div class="top-nav">
      <router-link to="/" class="brand">G</router-link>
      <div class="top-nav-right">
        <router-link to="/blog" class="back-journal">← Journal</router-link>
        <button class="theme-btn" :class="theme" @click="toggle" :aria-label="theme === 'dark' ? 'Light' : 'Dark'">
          <span class="toggle-track">
            <span class="toggle-thumb" />
            <span class="toggle-icon moon">☽</span>
            <span class="toggle-icon sun">☀</span>
          </span>
        </button>
      </div>
    </div>

    <template v-if="post">
      <div class="post-hero">
        <div class="post-kicker">
          <span class="cat-chip">{{ postCat(post) }}</span>
          <span class="dot-sep">·</span>
          <span class="date-str">{{ fmtMonth(post.date.slice(0,7)) }}</span>
          <span class="dot-sep">·</span>
          <span class="mins-str">{{ post.minutes }} min read</span>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
        <p class="post-excerpt">{{ post.excerpt }}</p>
        <div class="post-tags">
          <span v-for="t in post.tags" :key="t" class="tag">{{ t }}</span>
        </div>
        <div class="divider" />
      </div>

      <article class="post-article">
        <div class="prose" v-html="renderedContent" />
      </article>

      <div class="post-end">
        <div class="end-line" />
        <div class="end-meta">
          <span class="end-author">Ghaly Rizqi Mauludin</span>
          <span class="dot-sep">·</span>
          <span>Data Engineer, Jakarta</span>
        </div>
        <div class="end-tags">
          <span v-for="t in post.tags" :key="t" class="tag">{{ t }}</span>
        </div>
        <router-link to="/blog" class="more-link">More from the journal →</router-link>
      </div>
    </template>

    <template v-else-if="post === null">
      <div class="not-found">
        <h2>Post not found.</h2>
        <router-link to="/blog">← Back to journal</router-link>
      </div>
    </template>

    <SignatureFooter variant="editorial" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import ReadingProgress from '../components/ReadingProgress.vue'
import SignatureFooter from '../components/SignatureFooter.vue'
import { useTheme } from '../composables/useTheme.js'
import { getPost } from '../data/posts.js'
import { fmtMonth, postCat } from '../data/index.js'

const route = useRoute()
const { theme, toggle } = useTheme()

// Configure marked with syntax highlighting
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  }
}))

marked.use({
  renderer: {
    blockquote(token) {
      const text = this.parser.parse(token.tokens)
      return `<blockquote class="pull-quote">${text}</blockquote>`
    },
    image(token) {
      return `<figure class="post-figure">
        <img src="${token.href}" alt="${token.text}" loading="lazy" />
        ${token.title ? `<figcaption>${token.title}</figcaption>` : ''}
      </figure>`
    }
  }
})

const post = computed(() => getPost(route.params.slug))
const renderedContent = computed(() => post.value ? marked(post.value.content) : '')
</script>

<style scoped>
.page {
  background: var(--bg);
  min-height: 100vh;
  font-family: var(--sans);
}

/* ── Top nav ── */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 48px;
  border-bottom: 1px solid var(--line-soft);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 100;
  transition: background 0.25s;
}
.brand {
  font-family: var(--display);
  font-size: 40px;
  line-height: 0.85;
  color: var(--fg);
  text-decoration: none;
  transition: color 0.15s;
}
.brand:hover { color: var(--accent); }
.top-nav-right { display: flex; align-items: center; gap: 24px; }
.back-journal {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--fg-muted);
  transition: color 0.15s;
}
.back-journal:hover { color: var(--accent); }

/* Theme toggle (same as Navbar) */
.theme-btn {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.toggle-track {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 99px;
  border: 1.5px solid var(--line);
  background: var(--bg);
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: background 0.25s, border-color 0.25s;
}
.theme-btn.dark .toggle-track { background: var(--paper); }
.toggle-thumb {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--fg);
  left: 4px;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
}
.theme-btn.dark .toggle-thumb { transform: translateX(20px); }
.toggle-icon {
  position: absolute;
  font-size: 10px;
  line-height: 1;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}
.toggle-icon.sun  { right: 5px; }
.toggle-icon.moon { left: 5px; }
.theme-btn.light .toggle-icon.sun  { opacity: 1; }
.theme-btn.dark  .toggle-icon.moon { opacity: 1; }

/* ── Hero ── */
.post-hero {
  max-width: 720px;
  margin: 0 auto;
  padding: 72px 24px 0;
}
.post-kicker {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 24px;
}
.cat-chip { color: var(--accent); }
.dot-sep { color: var(--fg-subtle); }
.date-str, .mins-str { color: var(--fg-muted); }

.post-title {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 52px;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: var(--fg);
  margin-bottom: 24px;
  text-wrap: balance;
}
.post-excerpt {
  font-family: var(--serif);
  font-size: 22px;
  line-height: 1.5;
  color: var(--fg-muted);
  font-style: italic;
  margin-bottom: 24px;
  text-wrap: pretty;
}
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 40px;
}
.tag {
  font-family: var(--mono);
  font-size: 11px;
  padding: 4px 10px;
  border: 1px solid var(--line-soft);
  color: var(--fg-muted);
  border-radius: 99px;
}
.divider {
  height: 1px;
  background: var(--line-soft);
  margin-bottom: 0;
}

/* ── Article body ── */
.post-article {
  max-width: 720px;
  margin: 0 auto;
  padding: 56px 24px 80px;
}

/* ── End section ── */
.post-end {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px 80px;
}
.end-line {
  height: 1px;
  background: var(--line-soft);
  margin-bottom: 32px;
}
.end-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--serif);
  font-size: 16px;
  color: var(--fg-muted);
  margin-bottom: 16px;
}
.end-author { color: var(--fg); font-weight: 500; }
.end-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 32px;
}
.more-link {
  display: inline-block;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--fg-muted);
  border-bottom: 1px solid currentColor;
  padding-bottom: 2px;
  transition: color 0.15s;
}
.more-link:hover { color: var(--accent); }

.not-found {
  max-width: 720px;
  margin: 80px auto;
  padding: 0 24px;
  font-family: var(--serif);
  font-size: 20px;
  color: var(--fg-muted);
}

@media (max-width: 640px) {
  .top-nav { padding: 20px 24px; }
  .post-hero { padding: 48px 20px 0; }
  .post-article { padding: 40px 20px 60px; }
  .post-end { padding: 0 20px 60px; }
  .post-title { font-size: 36px; }
  .post-excerpt { font-size: 18px; }
}
</style>

<style>
/* ── Prose (global, inside .prose) ── */
.prose {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 21px;
  line-height: 1.8;
  color: var(--fg);
}

.prose p { margin: 0 0 1.5em; }

.prose h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--fg);
  margin: 2.4em 0 0.7em;
}

.prose h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--fg);
  margin: 2em 0 0.6em;
}

.prose h4 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin: 1.8em 0 0.5em;
}

.prose ul, .prose ol {
  padding-left: 1.6em;
  margin: 0 0 1.5em;
}
.prose li { margin-bottom: 0.4em; line-height: 1.7; }

.prose strong { font-weight: 600; color: var(--fg); }
.prose em { font-style: italic; }

.prose a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  transition: opacity 0.15s;
}
.prose a:hover { opacity: 0.75; }

.prose code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82em;
  background: var(--line-soft);
  color: var(--fg);
  padding: 0.15em 0.45em;
  border-radius: 3px;
  border: 1px solid var(--line-soft);
}

.prose pre {
  background: var(--paper);
  border: 1px solid var(--line-soft);
  border-radius: 4px;
  padding: 28px 32px;
  overflow-x: auto;
  margin: 0 0 1.8em;
  font-size: 14px;
  line-height: 1.7;
}
.prose pre code {
  background: none;
  border: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
}

/* Pull quote */
.prose .pull-quote {
  border-left: none;
  border-top: 2px solid var(--accent);
  border-bottom: 1px solid var(--line-soft);
  margin: 2em 0;
  padding: 24px 0 20px;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 26px;
  font-style: italic;
  line-height: 1.4;
  color: var(--fg);
  font-weight: 500;
}
.prose .pull-quote p { margin: 0; }

/* Figures */
.prose .post-figure {
  margin: 2em -40px;
  text-align: center;
}
.prose .post-figure img {
  max-width: 100%;
  width: 100%;
  display: block;
}
.prose .post-figure figcaption {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--fg-subtle);
  text-align: center;
  margin-top: 10px;
  letter-spacing: 0.5px;
}

.prose hr {
  border: none;
  text-align: center;
  margin: 2.5em 0;
  color: var(--fg-subtle);
  font-size: 20px;
  letter-spacing: 8px;
}
.prose hr::after { content: '· · ·'; }

/* Syntax highlight theme — adapts to dark/light */
:root .hljs { background: transparent; }
:root .hljs-keyword,
:root .hljs-selector-tag { color: var(--accent); }
:root .hljs-string,
:root .hljs-attr { color: oklch(62% 0.13 150); }
:root .hljs-comment { color: var(--fg-subtle); font-style: italic; }
:root .hljs-number,
:root .hljs-literal { color: oklch(62% 0.13 230); }
:root .hljs-function,
:root .hljs-title { color: oklch(62% 0.13 260); }
:root .hljs-built_in { color: oklch(62% 0.13 200); }
:root .hljs-variable { color: var(--fg); }

@media (max-width: 640px) {
  .prose { font-size: 18px; }
  .prose h2 { font-size: 26px; }
  .prose h3 { font-size: 20px; }
  .prose .pull-quote { font-size: 20px; }
  .prose .post-figure { margin: 2em 0; }
  .prose pre { padding: 20px; font-size: 13px; }
}
</style>
