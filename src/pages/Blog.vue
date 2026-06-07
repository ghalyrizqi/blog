<template>
  <div class="page">
    <header class="blog-hero">
      <h1>
        <span class="the">The</span>
        <span class="journal">journal</span>
        <span class="period">.</span>
      </h1>
    </header>

    <div class="filter-bar">
      <div class="filter-inner">
        <span class="filter-kicker">Section</span>
        <div class="filter-buttons">
          <button
            v-for="f in FILTERS"
            :key="f"
            :class="{ active: filter === f }"
            @click="filter = f"
          >{{ f }}</button>
        </div>
        <span class="filter-count">{{ visible.length }} of {{ BLOG_POSTS.length }}</span>
      </div>
    </div>

    <section v-if="visible.length > 0" class="lead-section">
      <div class="lead-inner">
        <div class="lead-kicker">Lead piece · {{ fmtMonth(visible[0].date.slice(0,7)) }}</div>
        <router-link :to="`/blog/${visible[0].slug}`">
          <h2 class="lead-title">{{ visible[0].title }}</h2>
        </router-link>
        <div class="lead-body">
          <p class="lead-excerpt">{{ visible[0].excerpt }}</p>
          <div class="lead-meta">
            <div class="filed-label">Filed under</div>
            <div class="filed-cat">{{ postCat(visible[0]) }} · {{ visible[0].minutes }} min read</div>
            <div class="lead-tags">
              <span v-for="t in visible[0].tags" :key="t" class="tag">{{ t }}</span>
            </div>
            <div v-if="visible[0].placeholder" class="placeholder-note">● Example layout — swap with real post</div>
          </div>
        </div>
      </div>
    </section>

    <section class="also-section">
      <div class="also-header">
        <h2 class="also-heading">Also inside.</h2>
        <div class="also-count">{{ Math.max(visible.length - 1, 0) }} more piece{{ visible.length - 1 !== 1 ? 's' : '' }}</div>
      </div>
      <div class="also-grid">
        <article v-for="p in visible.slice(1)" :key="p.slug" class="also-card">
          <div class="card-meta">
            <span>{{ fmtMonth(p.date.slice(0,7)) }}</span>
            <span>·</span>
            <span class="cat-accent">{{ postCat(p) }}</span>
            <span>·</span>
            <span>{{ p.minutes }} min</span>
            <span v-if="p.placeholder" class="draft">Draft</span>
          </div>
          <router-link :to="`/blog/${p.slug}`">
            <h3 class="card-title">{{ p.title }}</h3>
          </router-link>
          <p class="card-excerpt">{{ p.excerpt }}</p>
        </article>
      </div>
    </section>

    <div class="prefooter">
      <span>↳ Archive runs {{ BLOG_POSTS.length }} pieces deep</span>
    </div>

    <SignatureFooter variant="magazine" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SignatureFooter from '../components/SignatureFooter.vue'
import { fmtMonth, postCat } from '../data/index.js'
import { POSTS } from '../data/posts.js'
import { useSeoMeta, SITE_URL } from '../composables/useSeoMeta.js'

useSeoMeta({
  title: 'The Journal',
  description: 'Notes on data engineering, infrastructure, and tools. Written by Ghaly Rizqi Mauludin.',
  url: `${SITE_URL}/blog`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The Journal',
    description: 'Notes on data engineering, infrastructure, and tools.',
    url: `${SITE_URL}/blog`,
    author: { '@type': 'Person', name: 'Ghaly Rizqi Mauludin', url: SITE_URL },
    inLanguage: 'en',
  },
})

const BLOG_POSTS = POSTS
const FILTERS = ['All', 'Engineering', 'Personal']
const filter = ref('All')
const visible = computed(() =>
  filter.value === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(p => postCat(p) === filter.value)
)
</script>

<style scoped>
.page { background: var(--bg); min-height: 100vh; font-family: var(--sans); }

.blog-hero { padding: 48px clamp(24px, 5vw, 80px) 24px; }
h1 { font-weight: 400; line-height: 0.85; letter-spacing: -0.02em; max-width: 1080px; margin-left: auto; margin-right: auto; }
.the {
  font-family: var(--serif);
  font-size: 110px;
  font-style: italic;
  color: var(--fg-muted);
  display: block;
  letter-spacing: -0.03em;
}
.journal {
  font-family: var(--display);
  font-size: 240px;
  line-height: 0.85;
  color: var(--fg);
  display: block;
}
.period { font-family: var(--serif); font-size: 110px; color: var(--fg); letter-spacing: -0.03em; }

.filter-bar {
  padding: 24px clamp(24px, 5vw, 80px);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.filter-inner {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 1080px;
  margin: 0 auto;
}
.filter-kicker {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
}
.filter-buttons { display: flex; gap: 24px; font-family: var(--serif); font-size: 19px; }
.filter-buttons button {
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  color: var(--fg-muted);
  border-bottom: 2px solid transparent;
  padding-bottom: 2px;
}
.filter-buttons button.active {
  color: var(--fg);
  font-style: italic;
  border-bottom-color: var(--fg);
}
.filter-count {
  margin-left: auto;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg-muted);
}

.lead-section { padding: 64px clamp(24px, 5vw, 80px); border-bottom: 1px solid var(--line); }
.lead-inner { max-width: 1080px; margin-left: auto; margin-right: auto; }
.lead-kicker {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 14px;
}
.lead-title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: 88px;
  line-height: 1.0;
  letter-spacing: -0.03em;
  margin-bottom: 24px;
  text-wrap: balance;
  color: var(--fg);
  display: block;
  transition: color 0.15s var(--ease-out);
}
.lead-title:hover,
.lead-title:focus-visible { color: var(--accent); }
.lead-body { display: grid; grid-template-columns: 1.4fr 1fr; gap: 64px; align-items: start; }
.lead-excerpt {
  font-family: var(--serif);
  font-size: 22px;
  line-height: 1.45;
  color: var(--fg);
  text-wrap: pretty;
  font-style: italic;
}
.filed-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line);
}
.filed-cat { font-family: var(--serif); font-size: 18px; color: var(--fg); margin-bottom: 14px; }
.lead-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.tag {
  font-family: var(--mono);
  font-size: 11px;
  padding: 3px 9px;
  border: 1px solid var(--line-soft);
  color: var(--fg-muted);
  border-radius: 99px;
}
.placeholder-note { font-family: var(--mono); font-size: 11px; color: var(--accent); }

.also-section { padding: 64px clamp(24px, 5vw, 80px); }
.also-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 32px; max-width: 1080px; margin-left: auto; margin-right: auto; }
.also-heading { font-family: var(--serif); font-weight: 400; font-size: 56px; line-height: 1; letter-spacing: -0.02em; }
.also-count { font-family: var(--mono); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--fg-muted); }
.also-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; max-width: 1080px; margin-left: auto; margin-right: auto; }
.also-card { border-top: 2px solid var(--fg); padding-top: 16px; }
.card-meta {
  display: flex;
  gap: 10px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 14px;
}
.cat-accent { color: var(--accent); }
.draft { margin-left: auto; color: var(--accent); }
.card-title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 30px;
  line-height: 1.1;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
  display: block;
  color: var(--fg);
  transition: color 0.15s var(--ease-out);
}
.card-title:hover,
.card-title:focus-visible { color: var(--accent); }
.card-excerpt { font-family: var(--serif); font-size: 16px; line-height: 1.5; color: var(--fg-muted); text-wrap: pretty; }

.prefooter {
  display: flex;
  justify-content: space-between;
  padding: 24px clamp(24px, 5vw, 80px);
  border-top: 1px solid var(--line-soft);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
}

@media (max-width: 1024px) {
  .journal { font-size: 140px; }
  .the, .period { font-size: 64px; }
  .lead-title { font-size: 56px; }
  .lead-body { grid-template-columns: 1fr; gap: 32px; }
  .also-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .journal { font-size: 80px; }
  .the, .period { font-size: 40px; }
  .lead-title { font-size: 36px; }
  .also-heading { font-size: 36px; }
  .filter-buttons { gap: 16px; font-size: 16px; }
}
</style>
