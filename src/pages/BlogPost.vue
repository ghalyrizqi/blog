<template>
  <div class="page">
    <ReadingProgress />

    <template v-if="post">
      <div class="post-hero">
        <PostPhoto :slug="post.slug" :title="post.title" />
        <div class="post-hero-content">
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
        </div>
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
        <router-link to="/journal" class="more-link">More from the journal →</router-link>
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import ReadingProgress from '../components/ReadingProgress.vue'
import SignatureFooter from '../components/SignatureFooter.vue'
import PostPhoto from '../components/PostPhoto.vue'
import { getPost } from '../data/posts.js'
import { fmtMonth, postCat } from '../data/index.js'
import { useSeoMeta } from '../composables/useSeoMeta.js'
import { postMeta } from '../seo/routes.js'

const route = useRoute()

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
    },
    link(token) {
      const href = token.href
      const text = this.parser.parseInline(token.tokens)
      const external = href.startsWith('http://') || href.startsWith('https://')
      const attrs = external ? ` target="_blank" rel="noopener noreferrer"` : ''
      return `<a href="${href}"${attrs}>${text}</a>`
    }
  }
})

const post = computed(() => getPost(route.params.slug))
const renderedContent = computed(() => post.value ? marked(post.value.content) : '')


useSeoMeta(() => postMeta(post.value) || { title: 'Post Not Found' })
</script>

<style scoped>
.page {
  min-height: 100vh;
  font-family: var(--sans);
}

/* ── Hero ── */
.post-hero {
  position: relative;
  max-width: 760px;
  margin: 40px auto 0;
  border: 1px solid var(--line);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.post-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.011' numOctaves='4' seed='8' result='n'/%3E%3CfeDiffuseLighting in='n' surfaceScale='1.7' diffuseConstant='1.1' lighting-color='%23ffffff'%3E%3CfeDistantLight azimuth='225' elevation='57'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='420' height='420' filter='url(%23c)'/%3E%3C/svg%3E");
  background-size: 360px 360px;
  mix-blend-mode: soft-light;
  opacity: 0.68;
  z-index: 0;
}

.post-hero-content {
  position: relative;
  z-index: 1;
  padding: clamp(24px, 4vw, 44px);
}

.post-kicker {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 20px;
}
.cat-chip  { color: var(--accent); font-weight: 500; }
.dot-sep   { color: var(--fg-subtle); }
.date-str, .mins-str { color: var(--fg-muted); }

.post-title {
  font-family: var(--serif);
  font-weight: 700;
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: var(--fg);
  margin-bottom: 16px;
  text-wrap: balance;
}
.post-excerpt {
  font-family: var(--serif);
  font-size: 18px;
  line-height: 1.5;
  color: var(--fg);
  font-style: italic;
  margin-bottom: 20px;
  text-wrap: pretty;
}
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag {
  font-family: var(--mono);
  font-size: 11px;
  padding: 3px 9px;
  border: 1px solid var(--line);
  color: var(--fg-muted);
  border-radius: 99px;
}

/* ── Article body ── */
.post-article {
  max-width: 760px;
  margin: 0 auto;
  padding: 56px 24px 80px;
}

/* ── End section ── */
.post-end {
  max-width: 760px;
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
  transition: color 0.15s var(--ease-out);
}
.more-link:hover { color: var(--accent); }

.not-found {
  max-width: 760px;
  margin: 80px auto;
  padding: 0 24px;
  font-family: var(--serif);
  font-size: 20px;
  color: var(--fg-muted);
}

@media (max-width: 640px) {
  .post-hero { margin-top: 24px; }
  .post-article { padding: 40px 20px 60px; }
  .post-end { padding: 0 20px 60px; }
}
</style>

<style>
/* ── Prose (global, inside .prose) ── */
.prose {
  font-family: var(--serif);
  font-size: 21px;
  line-height: 1.8;
  color: var(--fg);
}

.prose p { margin: 0 0 1.5em; }

.prose h2 {
  font-family: var(--serif);
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--fg);
  margin: 2.4em 0 0.7em;
}

.prose h3 {
  font-family: var(--serif);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--fg);
  margin: 2em 0 0.6em;
}

.prose h4 {
  font-family: var(--mono);
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
  font-family: var(--mono);
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
  font-family: var(--serif);
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
  font-family: var(--mono);
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
:root .hljs-attr { color: var(--color-syntax-string); }
:root .hljs-comment { color: var(--fg-subtle); font-style: italic; }
:root .hljs-number,
:root .hljs-literal { color: var(--color-syntax-number); }
:root .hljs-function,
:root .hljs-title { color: var(--color-syntax-function); }
:root .hljs-built_in { color: var(--color-syntax-builtin); }
:root .hljs-variable { color: var(--fg); }

@media (max-width: 768px) {
  .prose { font-size: 19px; }
  .prose h2 { font-size: 28px; }
  .prose h3 { font-size: 22px; }
  .prose .post-figure { margin: 2em 0; }
}

@media (max-width: 640px) {
  .prose { font-size: 18px; }
  .prose h2 { font-size: 26px; }
  .prose h3 { font-size: 20px; }
  .prose .pull-quote { font-size: 20px; }
  .prose pre { padding: 20px; font-size: 13px; }
}
</style>
