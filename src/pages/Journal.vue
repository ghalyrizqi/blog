<template>
  <div class="page">

    <!-- ── Nameplate ── -->
    <header class="nameplate paper">
      <div class="np-rule" />
      <h1 class="np-title">
        <span class="np-the">The</span>
        {{ ' ' }}
        <span class="np-second">Second</span>
        {{ ' ' }}
        <span class="np-brain">Brain</span>
      </h1>
      <div class="np-rule-thick" />
      <div class="np-folio">
        <span>{{ BLOG_POSTS.length }} dispatches</span>
        <span>{{ today }}</span>
      </div>
    </header>

    <!-- ── Hero photo ── -->
    <section class="hero paper">
      <div class="hero-photo">
        <PostPhoto slug="journal-hero" title="Editor's note" preset="abstract" />
        <div class="hero-overlay">
          <span class="hero-kicker">Editor's note</span>
          <p class="hero-lede">Notes on data engineering, infrastructure, and tools. Written when something is worth writing down.</p>
        </div>
      </div>
      <div class="hero-foot">
        <span class="contents-label">Section</span>
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
    </section>

    <!-- ── Section head ── -->
    <div class="section-head paper">
      <span class="sh-mark" />
      <span class="sh-text">The Dispatch — {{ visible.length }} pieces, newest first</span>
      <span class="sh-mark" />
    </div>

    <!-- ── Post editions ── -->
    <main class="editions paper">
      <article
        v-for="(post, i) in visible"
        :key="post.slug"
        class="edition"
        :class="{ 'edition-first': i === 0 }"
      >
        <router-link :to="`/journal/${post.slug}`" class="edition-card">
          <div class="photo-window">
            <PostPhoto :slug="post.slug" :title="post.title" />
            <div class="ed-body">
              <div class="ed-furniture">
                <span class="ed-cat">{{ postCat(post) }}</span>
                <span class="ed-sep">·</span>
                <span>{{ fmtMonth(post.date.slice(0, 7)) }}</span>
                <span class="ed-sep">·</span>
                <span>{{ post.minutes }} min read</span>
                <span v-if="post.placeholder" class="ed-draft">Draft</span>
              </div>
              <h2 class="ed-headline">{{ post.title }}</h2>
              <p class="ed-lede">{{ post.excerpt }}</p>
              <div class="ed-tags">
                <span v-for="t in post.tags" :key="t" class="ed-tag">{{ t }}</span>
              </div>
            </div>
          </div>
        </router-link>
      </article>
    </main>

    <SignatureFooter variant="magazine" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SignatureFooter from '../components/SignatureFooter.vue'
import PostPhoto from '../components/PostPhoto.vue'
import { fmtMonth, postCat } from '../data/index.js'
import { POSTS } from '../data/posts.js'
import { useSeoMeta, SITE_URL } from '../composables/useSeoMeta.js'

useSeoMeta({
  title: 'The Second Brain',
  description: 'Notes on data engineering, infrastructure, and tools. Written by Ghaly Rizqi Mauludin.',
  url: `${SITE_URL}/journal`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The Second Brain',
    description: 'Notes on data engineering, infrastructure, and tools.',
    url: `${SITE_URL}/journal`,
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

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
})
</script>

<style scoped>
/* ── Page tokens ── */
.page {
  --ink:       var(--fg);
  --ink-soft:  var(--fg-muted);
  --ink-faint: var(--fg-subtle);
  --rule:      var(--line);
  --rule-soft: var(--line-soft);
  color: var(--fg);
  min-height: 100vh;
  transition: color 0.25s;
}

/* ── Container ── */
.paper {
  max-width: 1180px;
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(20px, 5vw, 72px);
  padding-right: clamp(20px, 5vw, 72px);
}

/* ── Nameplate ── */
.nameplate { padding-top: 8px; text-align: center; }

.np-rule { height: 1px; background: var(--rule); margin-bottom: 12px; }

.np-rule-thick {
  height: 0;
  border-top: 4px double var(--rule);
  margin-top: 6px;
}

.np-title {
  font-weight: 400;
  font-size: clamp(42px, 8.6vw, 120px);
  line-height: 1;
  margin: 8px 0 6px;
  white-space: nowrap;
}

.np-the   { font-family: var(--serif); font-style: italic; color: var(--ink-soft); letter-spacing: -0.01em; }
.np-second { font-family: var(--display); color: var(--ink); }
.np-brain { font-family: var(--display); color: var(--ink); }

.np-folio {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin-top: 10px;
  padding-bottom: 4px;
}

/* ── Hero photo ── */
.hero { margin-top: 40px; }

.hero-photo {
  position: relative;
  width: 100%;
  height: auto;
  min-height: clamp(140px, 16vw, 200px);
  border: 1px solid var(--rule);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.hero-overlay {
  position: relative;
  padding: clamp(20px, 3vw, 36px);
  max-width: 640px;
}

.hero-kicker {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg-muted);
  display: block;
}

.hero-lede {
  font-family: var(--serif);
  font-size: clamp(16px, 2vw, 22px);
  line-height: 1.42;
  color: var(--fg);
  margin-top: 10px;
  text-wrap: pretty;
}

.hero-foot {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 16px 0;
  border-bottom: 1px solid var(--rule-soft);
}

.contents-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-faint);
  white-space: nowrap;
}

.filter-buttons { display: flex; gap: 20px; }

.filter-buttons button {
  border: none;
  background: transparent;
  font-family: var(--serif);
  font-size: 16px;
  color: var(--ink-soft);
  border-bottom: 2px solid transparent;
  padding-bottom: 2px;
  cursor: pointer;
  transition: color 0.15s var(--ease-out);
}

.filter-buttons button.active {
  color: var(--ink);
  font-style: italic;
  border-bottom-color: var(--ink);
}

.filter-count {
  margin-left: auto;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-faint);
}

/* ── Section head ── */
.section-head {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 56px 0 8px;
}

.sh-mark { flex: 1; height: 1px; background: var(--rule-soft); }

.sh-text {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-soft);
  white-space: nowrap;
}

/* ── Crease / newsprint texture ── */
.photo-window::before,
.hero-photo::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.011' numOctaves='4' seed='8' result='n'/%3E%3CfeDiffuseLighting in='n' surfaceScale='1.7' diffuseConstant='1.1' lighting-color='%23ffffff'%3E%3CfeDistantLight azimuth='225' elevation='57'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='420' height='420' filter='url(%23c)'/%3E%3C/svg%3E");
  background-size: 360px 360px;
  mix-blend-mode: soft-light;
  opacity: 0.68;
}

/* ── Editions ── */
.editions { display: flex; flex-direction: column; }

.edition {
  padding: 44px 0;
  border-top: 1px solid var(--rule-soft);
}

.edition-first { border-top: none; }

.edition-card {
  display: block;
  text-decoration: none;
}

.photo-window {
  position: relative;
  min-height: 200px;
  border: 1px solid var(--rule);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

/* Editorial body overlaid on canvas */
.ed-body {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: clamp(20px, 3vw, 36px);
}

.ed-furniture {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 14px;
}

.ed-cat   { color: var(--accent); font-weight: 500; }
.ed-sep   { color: var(--fg-subtle); }
.ed-draft { color: var(--accent); margin-left: auto; }

.ed-headline {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(22px, 2.8vw, 34px);
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--fg);
  margin-bottom: 10px;
  text-wrap: balance;
  display: block;
  transition: color 0.15s var(--ease-out);
}


.ed-lede {
  font-family: var(--serif);
  font-size: 17px;
  line-height: 1.6;
  color: var(--fg-muted);
  text-wrap: pretty;
}

.ed-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
}

.ed-tag {
  font-family: var(--mono);
  font-size: 11px;
  padding: 3px 8px;
  border: 1px solid var(--line-soft);
  color: var(--fg-muted);
}

@media (max-width: 600px) {
  .np-title { white-space: normal; }
  .np-folio { font-size: 9px; gap: 8px; }
  .hero-lede { font-size: 16px; }
  .photo-window { min-height: 160px; }
  .hero-overlay { padding: 20px; }
}
</style>
