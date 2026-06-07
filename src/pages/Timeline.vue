<template>
  <div class="page">
    <header class="timeline-hero">
      <div class="hero-grid">
        <h1>
          <span class="the">The</span>
          <span class="career">career</span>
          <span class="archive">archive.</span>
        </h1>
        <div class="editors-note">
          <div class="note-label">Editor's note</div>
          <p class="note-body">
            Every job and detour since 2019. I've built a lot of pipelines and broken more than I'd admit.
          </p>
        </div>
      </div>
    </header>

    <!-- Centerline body -->
    <section class="centerline">
      <div class="center-line" />
      <div class="entries">
        <template v-for="it in items" :key="it.key">
          <div v-if="it.kind === 'year'" class="year-marker">
            <div class="year-line" />
            <div class="year-label">{{ it.year }}</div>
          </div>
          <div v-else class="entry-row" :class="it.side">
            <div class="center-node" :style="{ borderColor: HYB_TYPE[it.entry.type].dot }" />
            <div class="connector" :class="it.side" />
            <div class="entry-card" :class="it.side">
              <button class="toggle-btn" :class="it.side" @click="toggle(it.entry.id)">
                {{ expanded.has(it.entry.id) ? '− Less' : '+ More' }}
              </button>
              <div class="card-header" :class="it.side">
                <span class="type-dot" :style="{ background: HYB_TYPE[it.entry.type].dot }" />
                <span class="type-label" :style="{ color: HYB_TYPE[it.entry.type].tone }">
                  {{ HYB_TYPE[it.entry.type].label }}
                </span>
                <span class="meta-sep">·</span>
                <span class="date-range">{{ fmtRange(it.entry.start, it.entry.end) }}</span>
                <span class="meta-sep">·</span>
                <span class="duration">{{ fmtDuration(it.entry.start, it.entry.end) }}</span>
                <span v-if="it.entry.current" class="now-badge" :style="{ color: HYB_TYPE[it.entry.type].tone }">
                  <span class="pulse now-dot" :style="{ background: HYB_TYPE[it.entry.type].dot }" />
                  Now
                </span>
              </div>
              <h3 class="entry-role">{{ it.entry.role }}</h3>
              <div class="entry-org">
                {{ it.entry.org }}
                <span v-if="it.entry.orgNote" class="org-note"> · {{ it.entry.orgNote }}</span>
                · <em>{{ it.entry.location }}</em>
              </div>
              <p class="entry-summary">{{ it.entry.summary }}</p>
              <ul v-if="expanded.has(it.entry.id)" class="bullets">
                <li v-for="(b, i) in it.entry.bullets" :key="i">
                  <span class="bullet-arrow" :style="{ color: HYB_TYPE[it.entry.type].tone }">▸</span>
                  <span>{{ b }}</span>
                </li>
              </ul>
              <div class="entry-tags" :class="it.side">
                <span v-for="t in it.entry.tags" :key="t" class="tag">{{ t }}</span>
              </div>
            </div>
          </div>
        </template>
        <div class="origin">
          <div class="origin-square" />
          <div class="origin-label">↓ The beginning</div>
        </div>
      </div>
    </section>

    <SignatureFooter variant="editorial" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SignatureFooter from '../components/SignatureFooter.vue'
import { TIMELINE, fmtRange, fmtDuration } from '../data/index.js'
import { useSeoMeta, SITE_URL } from '../composables/useSeoMeta.js'

useSeoMeta({
  title: 'Career Archive',
  description: 'Every job and detour since 2019. Data engineering across Jakarta and Surabaya.',
  url: `${SITE_URL}/timeline`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: 'Career Archive — Ghaly Rizqi Mauludin',
    description: 'Every job and detour since 2019.',
    url: `${SITE_URL}/timeline`,
    mainEntity: {
      '@type': 'Person',
      name: 'Ghaly Rizqi Mauludin',
      jobTitle: 'Data Engineer',
      url: SITE_URL,
    },
  },
})

const HYB_TYPE = {
  work:      { label: 'Work',      dot: 'var(--accent)',   tone: 'var(--accent)'   },
  education: { label: 'Education', dot: 'var(--accent-3)', tone: 'var(--accent-3)' },
  volunteer: { label: 'Volunteer', dot: 'var(--accent-2)', tone: 'var(--accent-2)' },
}

// Build items list with year markers
const items = (() => {
  const out = []
  let lastYear = null
  let entryIdx = 0
  TIMELINE.forEach(entry => {
    const y = entry.start.split('-')[0]
    if (y !== lastYear) { out.push({ kind: 'year', year: y, key: `y-${y}` }); lastYear = y }
    const side = entryIdx % 2 === 0 ? 'right' : 'left'
    out.push({ kind: 'entry', entry, key: entry.id, side })
    entryIdx++
  })
  return out
})()

const expanded = ref(new Set([TIMELINE[0].id]))
function toggle(id) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id); else next.add(id)
  expanded.value = next
}
</script>

<style scoped>
.page { background: var(--bg); min-height: 100vh; font-family: var(--sans); }

.timeline-hero { padding: 48px clamp(24px, 5vw, 80px) 40px; }
.hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 80px; align-items: end; max-width: 1080px; margin-left: auto; margin-right: auto; }
h1 { font-weight: 400; line-height: 0.85; letter-spacing: -0.02em; }
.the {
  font-family: var(--serif);
  font-size: 100px;
  font-style: italic;
  color: var(--fg-muted);
  display: block;
  letter-spacing: -0.03em;
}
.career {
  font-family: var(--display);
  font-size: 220px;
  line-height: 0.85;
  color: var(--fg);
  display: block;
}
.archive { font-family: var(--serif); font-size: 100px; font-style: italic; color: var(--fg); letter-spacing: -0.03em; }
.note-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}
.note-body { font-family: var(--serif); font-size: 19px; line-height: 1.5; color: var(--fg); }

/* Centerline */
.centerline { position: relative; padding: 80px clamp(24px, 5vw, 80px) 120px; }
.center-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--line-soft);
  transform: translateX(-0.5px);
}
.entries { display: flex; flex-direction: column; gap: 56px; position: relative; max-width: 1080px; margin-left: auto; margin-right: auto; }

.year-marker { position: relative; height: 96px; display: flex; align-items: center; justify-content: center; }
.year-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--line-soft);
  transform: translateX(-0.5px);
}
.year-label {
  background: var(--bg);
  padding: 0 28px;
  font-family: var(--serif);
  font-size: 80px;
  font-style: italic;
  font-weight: 300;
  color: var(--fg-muted);
  letter-spacing: -0.03em;
  position: relative;
  line-height: 0.85;
}

.entry-row { position: relative; }
.center-node {
  position: absolute;
  left: 50%;
  top: 28px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid;
  transform: translateX(-50%);
  z-index: 2;
}
.connector {
  position: absolute;
  top: 34px;
  width: 42px;
  height: 1px;
  border-top: 1px dashed var(--line-soft);
}
.connector.right { left: calc(50% + 6px); }
.connector.left  { right: calc(50% + 6px); }

.entry-card {
  width: calc(50% - 48px);
  background: var(--paper);
  border: 1px solid var(--line-soft);
  padding: 28px;
  position: relative;
}
.entry-card.right { margin-left: calc(50% + 48px); text-align: left; }
.entry-card.left  { margin-left: 0; text-align: right; }

.toggle-btn {
  position: absolute;
  top: 24px;
  border: none;
  background: transparent;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg-muted);
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: color 0.15s var(--ease-out);
}
.toggle-btn:hover,
.toggle-btn:focus-visible { color: var(--accent); }
.toggle-btn.right { right: 24px; }
.toggle-btn.left  { left: 24px; }

.card-header {
  display: flex;
  gap: 10px;
  align-items: center;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.card-header.left { justify-content: flex-end; }
.type-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.type-label { display: inline-flex; align-items: center; gap: 6px; }
.meta-sep { color: var(--fg-subtle); }
.date-range, .duration { color: var(--fg-muted); }
.now-badge { display: inline-flex; align-items: center; gap: 5px; margin-left: 4px; }
.now-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }

.entry-role { font-family: var(--serif); font-weight: 500; font-size: 28px; line-height: 1.15; margin-bottom: 6px; }
.entry-org { font-size: 15px; color: var(--fg-muted); margin-bottom: 16px; }
.org-note { color: var(--fg-subtle); }
.entry-summary { font-family: var(--serif); font-size: 17px; line-height: 1.55; color: var(--fg); text-wrap: pretty; }

.bullets { list-style: none; margin: 18px 0 0; font-size: 14px; line-height: 1.6; color: var(--fg-muted); text-align: left; }
.bullets li { display: flex; gap: 10px; margin-bottom: 6px; }
.bullet-arrow { margin-top: 7px; }

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px dashed var(--line-soft);
}
.entry-tags.left { justify-content: flex-end; }
.tag {
  font-family: var(--mono);
  font-size: 11px;
  padding: 3px 8px;
  border: 1px solid var(--line-soft);
  color: var(--fg-muted);
  border-radius: 2px;
}

.origin { position: relative; text-align: center; padding-top: 24px; }
.origin-square {
  position: absolute;
  left: 50%;
  top: 24px;
  width: 10px;
  height: 10px;
  transform: translateX(-50%) rotate(45deg);
  background: var(--fg);
}
.origin-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-subtle);
  margin-top: 28px;
}

@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .career { font-size: 130px; }
  .the, .archive { font-size: 64px; }

  /* Drop the center-axis decorations — they don't work in single column */
  .center-line, .center-node, .connector, .year-line { display: none; }

  /* Left-rail: entries left border acts as the timeline spine */
  .entries {
    border-left: 1px solid var(--line-soft);
    padding-left: 32px;
    gap: 0;
  }

  .year-marker { height: auto; justify-content: flex-start; padding: 8px 0 20px; }
  .year-label { padding: 0; }

  .entry-row { padding-bottom: 40px; }

  /* All cards full-width, left-aligned */
  .entry-card { width: 100% !important; margin-left: 0 !important; text-align: left !important; }
  .card-header.left { justify-content: flex-start; }
  .entry-tags.left { justify-content: flex-start; }
  .bullets { text-align: left; }

  /* Take toggle-btn out of absolute so it doesn't overlap card-header on mobile */
  .toggle-btn {
    position: static;
    display: block;
    margin-left: auto;
    padding-bottom: 12px;
  }
  .toggle-btn.right,
  .toggle-btn.left { right: auto; left: auto; }

  .origin { text-align: left; }
  .origin-square { display: none; }
  .origin-label { margin-top: 0; }
}

@media (max-width: 640px) {
  .career { font-size: 80px; }
  .the, .archive { font-size: 40px; }
  .year-label { font-size: 40px; }
  .entry-role { font-size: 22px; }
  .entries { padding-left: 20px; }
  .entry-card { padding: 20px; }
}
</style>
