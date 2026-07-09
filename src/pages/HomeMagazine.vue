<template>
  <div class="page">

    <!-- ── Nameplate ── -->
    <header class="nameplate paper">
      <div class="np-rule" />
      <div class="np-overline">
        <span>Jakarta · Indonesia</span>
      </div>

      <div class="home-hero-grid">
        <div class="home-name">
          <span class="hn-hello">Hello, I'm</span>
          <span class="hn-name">Ghaly</span>
          <span class="hn-role">— Data Engineer</span>
        </div>
        <div class="home-about">
          <div class="np-kicker">About</div>
          <p class="home-aboutbody">
            Builds data pipelines on weekdays. Checks if they're still running on
            weekends. Upgraded two Airflow instances before IT Support could hand
            back the ThinkPad.
          </p>
          <span class="resume-link is-disabled" aria-disabled="true">↓ Résumé</span>
        </div>
      </div>

      <div class="np-rule-thick" />
      <div class="np-folio">
        <span>Vol. VII · No. 23</span>
        <span>{{ today }}</span>
        <span>Late Edition</span>
      </div>
    </header>

    <!-- ── Stats ── -->
    <section class="home-stats paper">
      <div v-for="s in stats" :key="s.label" class="stat">
        <div class="stat-num">{{ s.num }}</div>
        <div class="stat-label">{{ s.label }}</div>
        <div class="stat-sub">{{ s.sub }}</div>
      </div>
    </section>

    <!-- ── Toolkit ── -->
    <section class="home-section paper">
      <div class="section-head">
        <span class="sh-text">The Toolkit — {{ totalTools }} tools, {{ STACK.length }} categories</span>
        <span class="sh-mark" />
      </div>
      <div class="toolkit-grid">
        <div v-for="g in STACK" :key="g.group" class="toolkit-card">
          <div class="tk-stripe">
            <Dithering
              color-back="#00000000"
              color-front="var(--accent)"
              shape="swirl"
              type="8x8"
              :size="2"
              :speed="1"
            />
          </div>
          <div class="toolkit-label">{{ g.group }}</div>
          <div class="toolkit-items">{{ g.items.join(' · ') }}</div>
        </div>
      </div>
    </section>

    <!-- ── Dispatches ── -->
    <section class="home-section home-section-last paper">
      <div class="section-head">
        <span class="sh-text">Latest Dispatches</span>
        <span class="sh-mark" />
        <router-link to="/journal" class="sh-link">All posts →</router-link>
      </div>
      <div class="dispatch-grid">
        <article v-for="p in recent" :key="p.slug" class="dispatch-card">
          <figure class="photo-figure">
            <div class="photo-window">
              <PostPhoto :slug="p.slug" :title="p.title" />
              <div class="dispatch-overlay">
                <router-link :to="`/journal/${p.slug}`" class="dispatch-titlelink">
                  <h3 class="dispatch-title">{{ p.title }}</h3>
                </router-link>
                <p class="dispatch-excerpt">{{ p.excerpt }}</p>
              </div>
            </div>
            <figcaption class="photo-caption">
              <span class="photo-meta">{{ fmtMonth(p.date.slice(0, 7)) }} · {{ p.minutes }} min</span>
            </figcaption>
          </figure>
          <span v-if="p.placeholder" class="draft-tag">● Example</span>
        </article>
      </div>
    </section>

    <SignatureFooter variant="magazine" />
  </div>
</template>

<script setup>
import SignatureFooter from '../components/SignatureFooter.vue'
import PostPhoto from '../components/PostPhoto.vue'
import Dithering from '../components/Dithering.vue'
import { STACK, fmtMonth } from '../data/index.js'
import { POSTS } from '../data/posts.js'
import { useSeoMeta } from '../composables/useSeoMeta.js'
import { HOME_META } from '../seo/routes.js'

useSeoMeta(HOME_META)

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
})

const recent = POSTS.slice(0, 3)
const totalTools = STACK.reduce((a, g) => a + g.items.length, 0)

const stats = [
  { num: '77%',  label: 'warehouse cost cut', sub: 'one DuckDB box replaced Redshift' },
  { num: '500+', label: 'DAGs migrated',       sub: 'Airflow v2 → v3, two instances'  },
  { num: '4+',   label: 'years experience',    sub: 'as a Data Engineer'               },
]
</script>

<style scoped>
/* ── Page shell ── */
.page { min-height: 100vh; }

.paper {
  max-width: 1180px;
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(20px, 5vw, 72px);
  padding-right: clamp(20px, 5vw, 72px);
}

/* ── Nameplate ── */
.nameplate { padding-top: 8px; }

.np-rule {
  height: 1px;
  background: var(--line);
  margin-bottom: 12px;
}

.np-rule-thick {
  height: 0;
  border-top: 4px double var(--line);
  margin-top: 4px;
}

.np-overline {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-muted);
}

.np-folio {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-top: 10px;
  padding-bottom: 4px;
}

/* ── Hero grid ── */
.home-hero-grid {
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  gap: clamp(32px, 5vw, 72px);
  align-items: end;
  margin: 22px 0 28px;
}

.home-name {
  display: flex;
  flex-direction: column;
  line-height: 0.9;
}

.hn-hello {
  font-family: var(--serif);
  font-style: italic;
  font-size: clamp(28px, 3.4vw, 46px);
  color: var(--fg-muted);
  letter-spacing: -0.02em;
}

.hn-name {
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(96px, 17vw, 228px);
  line-height: 0.86;
  color: var(--fg);
  letter-spacing: -0.01em;
}

.hn-role {
  font-family: var(--serif);
  font-style: italic;
  font-size: clamp(26px, 3.2vw, 44px);
  color: var(--fg);
  letter-spacing: -0.02em;
}

.np-kicker {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
  display: inline-block;
}

.home-aboutbody {
  font-family: var(--serif);
  font-size: clamp(17px, 1.6vw, 21px);
  line-height: 1.55;
  color: var(--fg);
  text-wrap: pretty;
}

.resume-link {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fg);
  border: 1px solid var(--line);
  padding: 8px 16px;
  text-decoration: none;
  margin-top: 18px;
  display: inline-block;
  transition: background 0.18s var(--ease-out), color 0.18s var(--ease-out);
}
.resume-link:hover { background: var(--fg); color: var(--bg); }
.resume-link.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Photo card thumbnails (dispatch cards) ── */
.photo-figure { margin: 0; }

.photo-window {
  position: relative;
  height: 240px;
  border: 1px solid var(--line);
  overflow: hidden;
  display: flex;
  align-items: center;
}

.dispatch-overlay {
  position: relative;
  z-index: 1;
  padding: clamp(14px, 2vw, 20px);
}

.photo-window::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(177deg, transparent 48.6%, rgba(0,0,0,0.05) 49.6%, rgba(255,255,255,0.13) 50.6%, transparent 51.6%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.011' numOctaves='4' seed='8' result='n'/%3E%3CfeDiffuseLighting in='n' surfaceScale='1.7' diffuseConstant='1.1' lighting-color='%23ffffff'%3E%3CfeDistantLight azimuth='225' elevation='57'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='420' height='420' filter='url(%23c)'/%3E%3C/svg%3E");
  background-size: 100% 100%, 360px 360px;
  mix-blend-mode: soft-light;
  opacity: 0.68;
}

.photo-caption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
}

.photo-meta {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-subtle);
}

/* ── Stats ── */
.home-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--line-soft);
  margin-top: 44px;
}

.stat {
  padding: 28px 24px 28px 0;
  border-right: 1px solid var(--line-soft);
}
.stat:last-child { border-right: none; }

.stat-num {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(56px, 8.5vw, 108px);
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fg);
  margin: 12px 0 4px;
}

.stat-sub {
  font-family: var(--serif);
  font-style: italic;
  font-size: 15px;
  color: var(--fg-muted);
}

/* ── Section head ── */
.home-section { margin-top: 64px; }
.home-section-last { padding-bottom: 64px; }

.section-head {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
}

.sh-mark {
  flex: 1;
  height: 1px;
  background: var(--line-soft);
}

.sh-text {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg-muted);
  white-space: nowrap;
}

.sh-link {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fg);
  text-decoration: none;
  border-bottom: 1px solid var(--fg);
  padding-bottom: 2px;
  white-space: nowrap;
  transition: color 0.15s var(--ease-out), border-color 0.15s var(--ease-out);
}
.sh-link:hover { color: var(--fg-muted); border-color: var(--fg-muted); }

/* ── Toolkit ── */
.toolkit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--line-soft);
  border: 1px solid var(--line-soft);
}

.toolkit-card {
  background: var(--paper);
  padding: 24px 22px 26px;
  position: relative;
}

.tk-stripe {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 5px;
  display: block;
}

.toolkit-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 6px 0 12px;
}

.toolkit-items {
  font-family: var(--serif);
  font-size: 18px;
  line-height: 1.6;
  color: var(--fg);
  text-wrap: pretty;
}

/* ── Dispatches ── */
.dispatch-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(24px, 3vw, 36px);
}

.dispatch-card { display: flex; flex-direction: column; }

.dispatch-titlelink { text-decoration: none; }

.dispatch-title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 20px;
  line-height: 1.16;
  letter-spacing: -0.01em;
  color: var(--fg);
  margin: 0 0 8px;
  transition: color 0.15s var(--ease-out);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.dispatch-titlelink:hover .dispatch-title { color: var(--accent); }

.dispatch-excerpt {
  font-family: var(--serif);
  font-size: 13px;
  line-height: 1.5;
  color: var(--fg);
  text-wrap: pretty;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.draft-tag {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-top: 12px;
}

/* ── Responsive ── */
@media (max-width: 980px) {
  .home-hero-grid { grid-template-columns: 1fr; gap: 28px; align-items: start; }
  .toolkit-grid { grid-template-columns: 1fr 1fr; }
  .dispatch-grid { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .home-stats { grid-template-columns: 1fr; }
  .stat { border-right: none; border-bottom: 1px solid var(--line-soft); padding-right: 0; }
  .toolkit-grid { grid-template-columns: 1fr; }
  .np-overline, .np-folio { font-size: 9px; gap: 8px; }
  .photo-window { height: 170px; }
  .dispatch-overlay { padding: 12px; }
  .dispatch-title { font-size: 17px; margin-bottom: 4px; }
  .dispatch-excerpt { -webkit-line-clamp: 2; }
}
</style>
