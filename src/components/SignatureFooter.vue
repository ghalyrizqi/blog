<template>
  <footer :class="['sig-footer', variant]">
    <div class="inner">
      <div class="sig-left">
        <div class="kicker">↳ Signed,</div>
        <div class="big-g">G</div>
        <div class="byline">Ghaly Rizqi Mauludin · Data Engineer · Jakarta</div>
      </div>
      <div class="sig-right">
        <div class="contact-label">↳ Get in touch</div>
        <ul>
          <li v-for="link in links" :key="link.label">
            <span class="link-label">{{ link.label }}</span>
            <a :href="link.href" class="link-value">
              <span>{{ link.value }}</span>
              <span class="arrow">→</span>
            </a>
          </li>
        </ul>
        <div class="meta">
          <span>© 2026 — Vue, Vite, Jakarta.</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({ variant: { type: String, default: 'editorial' } })

const links = [
  { label: 'Email',    value: 'ghalyrizqimauludin@gmail.com', href: 'mailto:ghalyrizqimauludin@gmail.com' },
  { label: 'GitHub',   value: 'github.com/ghalyrizqi',        href: 'https://github.com/ghalyrizqi' },
  { label: 'LinkedIn', value: 'linkedin.com/in/ghalyrizqi',   href: 'https://linkedin.com/in/ghalyrizqi' },
]
</script>

<style scoped>
.sig-footer {
  border-top: 1px solid var(--line);
}
.sig-footer.editorial {
  padding: 80px clamp(24px, 5vw, 80px) 56px;
  background: var(--bg);
}
.sig-footer.magazine {
  padding: 96px clamp(24px, 5vw, 80px) 72px;
  background: var(--paper);
}
.inner {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 80px;
  align-items: end;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
}
.kicker {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 24px;
}
.big-g {
  font-family: var(--display);
  font-size: 180px;
  line-height: 0.82;
  color: var(--fg);
  letter-spacing: -0.02em;
  margin-left: -10px;
}
.magazine .big-g { font-size: 220px; }
.byline {
  font-family: var(--serif);
  font-size: 18px;
  font-style: italic;
  color: var(--fg-muted);
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--line-soft);
  max-width: 360px;
}
.contact-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}
ul { list-style: none; }
li {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line-soft);
}
.link-label {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--fg-muted);
  min-width: 80px;
}
.link-value {
  font-family: var(--serif);
  font-size: 20px;
  color: var(--fg);
  display: inline-flex;
  align-items: baseline;
  gap: 12px;
  letter-spacing: -0.01em;
  transition: color 0.15s var(--ease-out);
}
.link-value:hover,
.link-value:focus-visible { color: var(--accent); }
.arrow { color: var(--accent); }
.meta {
  display: flex;
  justify-content: space-between;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg-subtle);
  margin-top: 28px;
}

@media (max-width: 768px) {
  .sig-footer.editorial { padding: 56px 24px 40px; }
  .sig-footer.magazine  { padding: 56px 24px 40px; }
  .inner { grid-template-columns: 1fr; gap: 48px; }
  .big-g { font-size: 100px; }
  .magazine .big-g { font-size: 100px; }
}
</style>
