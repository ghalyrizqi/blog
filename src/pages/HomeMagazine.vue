<template>
  <div class="page">
    <header class="hero-header">
      <div class="hero-grid">
        <h1>
          <span class="hello">Hello, I'm</span>
          <span class="name">Ghaly</span>
          <span class="hello">Data Engineer</span>
        </h1>
        <div class="editors-note">
          <div class="note-kicker">The short version</div>
          <p class="note-body">
            Data engineer in Jakarta. Four years building pipelines and migrating warehouses, mostly at bad hours.
          </p>
        </div>
      </div>

      <div class="stats-row">
        <div v-for="s in stats" :key="s.label" class="stat">
          <div class="stat-num">{{ s.num }}</div>
          <div class="stat-label">{{ s.label }}</div>
          <div class="stat-sub">{{ s.sub }}</div>
        </div>
      </div>
    </header>

    <section class="cover-section">
      <div class="cover-grid">
        <div class="cover-left">
          <div class="cover-kicker">Latest piece</div>
          <p class="cover-lead">300 production DAGs and a live metadata database, no maintenance window. Notes from the Airflow v3 migration.</p>
          <router-link to="/blog" class="cover-cta">Read the notes →</router-link>
        </div>
        <div class="now-card">
          <div class="now-top">
            <span class="now-label">Now playing · {{ featured.org }}</span>
            <span class="live-badge">
              <span class="pulse live-dot" />
              Live · {{ fmtMonth(featured.start) }}
            </span>
          </div>
          <h2 class="now-role">{{ featured.role }}</h2>
          <p class="now-summary">{{ featured.summary }}</p>
          <div class="tags">
            <span v-for="t in featured.tags" :key="t" class="tag">{{ t }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="toolkit-section">
      <div class="toolkit-top">
        <h2 class="toolkit-heading">The toolkit</h2>
        <div class="toolkit-meta">{{ totalTools }} tools, {{ STACK.length }} categories.</div>
      </div>
      <div class="toolkit-grid">
        <div v-for="g in STACK" :key="g.group" class="toolkit-card">
          <div class="toolkit-label">{{ g.group }}</div>
          <div class="toolkit-items">{{ g.items.join(' · ') }}</div>
        </div>
      </div>
    </section>

    <section class="dispatches-section">
      <div class="dispatches-top">
        <h2 class="dispatches-heading">Latest <em>dispatches</em>.</h2>
        <router-link to="/blog" class="all-link">All posts →</router-link>
      </div>
      <div class="dispatches-grid">
        <article v-for="p in recent" :key="p.slug" class="dispatch-card">
          <div class="card-meta">
            <span>{{ fmtMonth(p.date.slice(0,7)) }}</span>
            <span class="sep">·</span>
            <span>{{ p.minutes }} min read</span>
            <span v-if="p.placeholder" class="draft">Draft</span>
          </div>
          <router-link :to="`/blog/${p.slug}`">
            <h3 class="card-title">{{ p.title }}</h3>
          </router-link>
          <p class="card-excerpt">{{ p.excerpt }}</p>
        </article>
      </div>
    </section>

    <SignatureFooter variant="magazine" />
  </div>
</template>

<script setup>
import SignatureFooter from '../components/SignatureFooter.vue'
import { TIMELINE, STACK, fmtMonth } from '../data/index.js'
import { POSTS } from '../data/posts.js'

const featured = TIMELINE.find(e => e.current)
const recent = POSTS.slice(0, 3)
const totalTools = STACK.reduce((a, g) => a + g.items.length, 0)

const stats = [
  { num: '77%',  label: 'warehouse cost cut',  sub: 'one DuckDB box replaced Redshift' },
  { num: '300+', label: 'DAGs migrated',        sub: 'Airflow v2 → v3, zero downtime' },
  { num: '99%',  label: 'pipeline uptime',      sub: 'moved off Windows cron, onto Airflow' },
]
</script>

<style scoped>
.page { background: var(--bg); min-height: 100vh; font-family: var(--sans); }

/* ── Hero ── */
.hero-header {
  padding: 48px clamp(24px, 5vw, 80px) 0;
  border-bottom: 1px solid var(--line);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 80px;
  align-items: end;
  margin-bottom: 48px;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  font-weight: 400;
  line-height: 0.88;
  letter-spacing: -0.02em;
  margin: 0;
}
.hello {
  font-family: var(--serif);
  font-size: 56px;
  font-style: italic;
  color: var(--fg-muted);
  display: block;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}
.name {
  font-family: var(--display);
  font-size: 200px;
  line-height: 0.88;
  color: var(--accent);
  display: block;
}

.note-kicker {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}
.note-body {
  font-family: var(--serif);
  font-size: 20px;
  line-height: 1.55;
  color: var(--fg);
  text-wrap: pretty;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--line-soft);
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
}
.stat {
  padding: 28px 0;
  border-right: 1px solid var(--line-soft);
}
.stat:last-child { border-right: none; }
.stat-num {
  font-family: var(--serif);
  font-size: 80px;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.stat-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg);
  margin-top: 10px;
  margin-bottom: 4px;
}
.stat-sub {
  font-family: var(--serif);
  font-size: 15px;
  color: var(--fg-muted);
  font-style: italic;
}

/* ── Cover ── */
.cover-section {
  padding: 64px clamp(24px, 5vw, 80px);
  border-bottom: 1px solid var(--line);
}
.cover-grid {
  display: grid;
  grid-template-columns: 0.4fr 1fr;
  gap: 56px;
  align-items: start;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
}
.cover-kicker {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 14px;
}
.cover-lead {
  font-family: var(--serif);
  font-size: 26px;
  font-style: italic;
  line-height: 1.3;
  margin-bottom: 24px;
  color: var(--fg);
}
.cover-cta {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
  border-bottom: 1px solid var(--fg-muted);
  padding-bottom: 2px;
  transition: color 0.15s var(--ease-out), border-color 0.15s var(--ease-out);
}
.cover-cta:hover,
.cover-cta:focus-visible { color: var(--accent); border-color: var(--accent); }

.now-card {
  background: var(--paper);
  padding: 36px;
  border: 1px solid var(--line-soft);
}
.now-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 8px;
}
.now-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
}
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--accent);
}
.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  display: inline-block;
}
.now-role {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 44px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}
.now-summary {
  font-family: var(--serif);
  font-size: 18px;
  line-height: 1.55;
  color: var(--fg-muted);
  margin-bottom: 20px;
  text-wrap: pretty;
}
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  font-family: var(--mono);
  font-size: 11px;
  padding: 3px 9px;
  border: 1px solid var(--line-soft);
  color: var(--fg-muted);
  border-radius: 99px;
}

/* ── Toolkit ── */
.toolkit-section {
  padding: 48px clamp(24px, 5vw, 80px);
  border-bottom: 1px solid var(--line);
}
.toolkit-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 32px;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
}
.toolkit-heading {
  font-family: var(--serif);
  font-weight: 400;
  font-size: 56px;
  line-height: 1;
  letter-spacing: -0.02em;
}
.toolkit-meta {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
}
.toolkit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--line-soft);
  border: 1px solid var(--line-soft);
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
}
.toolkit-card {
  background: var(--paper);
  padding: 28px 24px;
}
.toolkit-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}
.toolkit-items {
  font-family: var(--serif);
  font-size: 18px;
  line-height: 1.6;
  color: var(--fg);
}

/* ── Dispatches ── */
.dispatches-section { padding: 64px clamp(24px, 5vw, 80px); }
.dispatches-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 32px;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
}
.dispatches-heading {
  font-family: var(--serif);
  font-weight: 400;
  font-size: 56px;
  line-height: 1;
  letter-spacing: -0.02em;
}
.all-link {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--fg-muted);
  border-bottom: 1px solid currentColor;
  padding-bottom: 1px;
  transition: color 0.15s var(--ease-out);
}
.all-link:hover,
.all-link:focus-visible { color: var(--accent); }

.dispatches-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
}
.dispatch-card { border-top: 2px solid var(--fg); padding-top: 20px; }
.card-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 16px;
}
.sep { color: var(--fg-subtle); }
.draft { margin-left: auto; color: var(--accent); }
.card-title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 26px;
  line-height: 1.15;
  margin-bottom: 12px;
  display: block;
  color: var(--fg);
  transition: color 0.15s var(--ease-out);
}
.card-title:hover,
.card-title:focus-visible { color: var(--accent); }
.card-excerpt {
  font-family: var(--serif);
  font-size: 15px;
  line-height: 1.55;
  color: var(--fg-muted);
  text-wrap: pretty;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .name { font-size: 130px; }
  .hello { font-size: 40px; }
  .at-work { font-size: 52px; }
  .cover-grid { grid-template-columns: 1fr; }
  .toolkit-grid { grid-template-columns: repeat(2, 1fr); }
  .dispatches-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .name { font-size: 80px; }
  .hello { font-size: 28px; }
  .at-work { font-size: 36px; }
  .stat-num { font-size: 56px; }
  .stats-row { grid-template-columns: 1fr; }
  .stat { border-right: none; border-bottom: 1px solid var(--line-soft); }
  .toolkit-grid { grid-template-columns: 1fr; }
  .dispatches-grid { grid-template-columns: 1fr; }
  .toolkit-heading, .dispatches-heading { font-size: 40px; }
}
</style>
