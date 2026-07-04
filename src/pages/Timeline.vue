<template>
  <div class="page">

    <!-- ── Nameplate ── -->
    <header class="nameplate paper">
      <div class="np-rule" />
      <h1 class="np-title">
        <span class="np-the">The</span>
        {{ ' ' }}
        <span class="np-career">Career</span>
        {{ ' ' }}
        <span class="np-archive">Archive</span>
      </h1>
      <div class="np-rule-thick" />
      <div class="np-folio">
        <span>{{ today }}</span>
      </div>
    </header>

    <!-- ── Hero photo ── -->
    <section class="hero paper">
      <div class="hero-photo">
        <PostPhoto slug="timeline-hero" title="Sunrise over Jakarta" preset="abstract" />
        <div class="hero-overlay">
          <p class="hero-lede">
            Every job, internship, and detour since 2019. I kept Airflow alive,
            wired up Kafka, rebuilt half the warehouse in dbt, took down
            development once with an UPDATE missing a WHERE clause, and took
            down Airflow once by forcing a version update. 
            I drive for success and learn from mistakes.
          </p>
        </div>
      </div>
    </section>

    <!-- ── Section head ── -->
    <div class="section-head paper">
      <span class="sh-mark" />
      <span class="sh-text">The Archive — {{ TIMELINE.length }} skies, newest first</span>
      <span class="sh-mark" />
    </div>

    <!-- ── Editions ── -->
    <main class="editions paper">
      <article
        v-for="(entry, i) in TIMELINE"
        :key="entry.id"
        class="edition"
        :class="{ 'edition-first': i === 0 }"
      >
        <!-- Left: photo plate -->
        <figure class="photo-figure">
          <div class="photo-window">
            <PostPhoto :slug="entry.id" :title="entry.role" />
            <div class="ed-overlay">
              <div class="ed-furniture">
                <span class="ed-cat">
                  <span class="ed-dot" :style="{ background: TYPE[entry.type].tone }" />
                  {{ TYPE[entry.type].label }}
                </span>
                <span class="ed-sep">·</span>
                <span>{{ fmtRange(entry.start, entry.end) }}</span>
                <span class="ed-sep">·</span>
                <span>{{ fmtDuration(entry.start, entry.end) }}</span>
                <span v-if="entry.current" class="ed-live">
                  <span class="ed-livedot pulse" :style="{ background: TYPE[entry.type].tone }" />
                  On the desk
                </span>
              </div>

              <h2 class="ed-headline">{{ entry.role }}</h2>
              <p class="ed-dek">
                <span class="ed-org">{{ entry.org }}</span>
                <span v-if="entry.orgNote" class="ed-note"> — {{ entry.orgNote }}</span>
                <span class="ed-loc"> · {{ entry.location }}</span>
              </p>
            </div>
          </div>
        </figure>

        <!-- Right: editorial body -->
        <div class="ed-body">
          <p class="ed-lede">{{ entry.summary }}</p>

          <ul v-if="expanded.has(entry.id)" class="ed-bullets">
            <li v-for="(b, bi) in entry.bullets" :key="bi">
              <span class="ed-mark" :style="{ color: TYPE[entry.type].tone }">—</span>
              <span>{{ b }}</span>
            </li>
          </ul>

          <button class="ed-toggle" @click="toggle(entry.id)">
            {{ expanded.has(entry.id) ? 'Close the report' : 'Read the full report' }}
            <span class="ed-toggle-ic">{{ expanded.has(entry.id) ? '–' : '+' }}</span>
          </button>

          <div class="ed-tags">
            <span v-for="t in entry.tags" :key="t" class="ed-tag">{{ t }}</span>
          </div>
        </div>
      </article>
    </main>

    <SignatureFooter variant="editorial" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SignatureFooter from '../components/SignatureFooter.vue'
import PostPhoto from '../components/PostPhoto.vue'
import { TIMELINE, fmtRange, fmtDuration } from '../data/index.js'
import { useSeoMeta } from '../composables/useSeoMeta.js'
import { TIMELINE_META } from '../seo/routes.js'

useSeoMeta(TIMELINE_META)

const TYPE = {
  work:      { label: 'Work',      tone: 'var(--accent)'   },
  intern:    { label: 'Intern',    tone: 'var(--accent)'   },
  education: { label: 'Undergraduate', tone: 'var(--accent-3)' },
  volunteer: { label: 'Volunteer', tone: 'var(--accent-2)' },
}

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
})

const expanded = ref(new Set([TIMELINE[0].id]))
function toggle(id) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id); else next.add(id)
  expanded.value = next
}
</script>

<style scoped>
/* ── Page tokens (aliased from project vars) ── */
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
  font-size: clamp(42px, 8.6vw, 120px);
  line-height: 1;
  font-weight: 400;
  margin: 8px 0 6px;
  white-space: nowrap;
}

.np-the {
  font-family: var(--serif);
  font-style: italic;
  color: var(--ink-soft);
  letter-spacing: -0.01em;
}

.np-career {
  font-family: var(--display);
  color: var(--ink);
}

.np-archive {
  font-family: var(--display);
  color: var(--ink);
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
  padding: clamp(24px, 4vw, 44px);
  max-width: 680px;
}

.hero-lede {
  font-family: var(--serif);
  font-size: clamp(19px, 2.3vw, 27px);
  line-height: 1.42;
  color: var(--ink);
  margin-top: 14px;
  text-wrap: pretty;
}


/* ── Section head ── */
.section-head {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 64px 0 8px;
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

/* ── Crease / newsprint texture (all photo panels) ── */
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
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: clamp(32px, 5vw, 72px);
  align-items: start;
  padding: 52px 0;
  border-top: 1px solid var(--rule-soft);
}
.edition-first { border-top: none; }

/* Photo plate */
.photo-figure { margin: 0; }

.photo-window {
  position: relative;
  height: 190px;
  border: 1px solid var(--rule);
  overflow: hidden;
  display: flex;
  align-items: center;
}

.ed-overlay {
  position: relative;
  z-index: 1;
  padding: clamp(14px, 2vw, 20px);
  color: var(--ink);
}


/* Editorial body */
.ed-body { padding-top: 4px; }

.ed-furniture {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.ed-cat { display: inline-flex; align-items: center; gap: 7px; font-weight: 500; }
.ed-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.ed-live { display: inline-flex; align-items: center; gap: 6px; margin-left: 2px; }
.ed-livedot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }

.ed-headline {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(20px, 2.4vw, 28px);
  line-height: 1.04;
  letter-spacing: -0.015em;
  margin-bottom: 6px;
  text-wrap: balance;
}

.ed-dek {
  font-family: var(--serif);
  font-size: 15px;
}
.ed-org { font-weight: 600; }
.ed-note { font-style: italic; }
.ed-loc { font-style: italic; }

.ed-lede {
  font-family: var(--serif);
  font-size: 19px;
  line-height: 1.6;
  color: var(--ink);
  max-width: 60ch;
  text-wrap: pretty;
}

.ed-bullets {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  max-width: 60ch;
}

.ed-bullets li {
  display: flex;
  gap: 12px;
  font-family: var(--serif);
  font-size: 17px;
  line-height: 1.55;
  color: var(--ink-soft);
  padding: 7px 0;
  border-top: 1px solid var(--rule-soft);
}
.ed-bullets li:first-child { border-top: none; }
.ed-mark { flex-shrink: 0; }

.ed-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  background: none;
  border: none;
  padding: 0 0 3px;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink);
  border-bottom: 1px solid var(--ink);
  transition: color 0.15s var(--ease-out), border-color 0.15s var(--ease-out);
}
.ed-toggle:hover { color: var(--ink-soft); border-color: var(--ink-soft); }
.ed-toggle-ic { font-size: 14px; line-height: 1; }

.ed-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 24px;
}

.ed-tag {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  padding: 4px 9px;
  border: 1px solid var(--rule-soft);
  color: var(--ink-soft);
}

/* ── Responsive ── */
@media (max-width: 860px) {
  .edition { grid-template-columns: 1fr; gap: 24px; }
  .photo-window { height: 170px; }
}

@media (max-width: 600px) {
  .np-folio { font-size: 9px; gap: 8px; }
  .hero-overlay { padding: 20px; }
  .hero-lede { font-size: 16px; }
}
</style>
