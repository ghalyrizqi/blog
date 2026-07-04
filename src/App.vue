<template>
  <div class="site-background">
    <PaperTexture
      :color-back="paperColors.colorBack"
      :color-front="paperColors.colorFront"
      :contrast="0.7"
      :roughness="0.6"
      :fiber="0.5"
      :crumples="0.5"
      :folds="0.7"
    />
  </div>
  <div class="page-content">
    <div class="global-nav-wrapper">
      <Navbar :current="currentPage" />
    </div>
    <RouterView />
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import PaperTexture from './components/PaperTexture.vue'
import { useTheme } from './composables/useTheme.js'
import { resolveCssColor } from './lib/resolveCssColor.js'

const route = useRoute()

const currentPage = computed(() => {
  const name = route.name
  if (name === 'journal' || name === 'post') return 'journal'
  if (name === 'timeline') return 'timeline'
  return 'home'
})

// PaperTexture's colorBack/colorFront are resolved once per value change, so
// a static "var(--bg)" string wouldn't react to the theme flip on its own —
// re-resolve to concrete values whenever the theme toggles instead.
const { theme } = useTheme()

function currentPaperColors() {
  return {
    colorBack: resolveCssColor('var(--bg)'),
    // --paper is nearly identical to --bg (too subtle for visible grain) and
    // --line flips direction between themes (darker than bg in light mode,
    // lighter in dark mode — great for borders, bad for a symmetric grain).
    // Blending toward --fg by a fixed percentage stays consistent either way.
    colorFront: resolveCssColor('color-mix(in oklab, var(--bg), var(--fg) 12%)'),
  }
}

const paperColors = ref(currentPaperColors())

watch(theme, async () => {
  await nextTick()
  paperColors.value = currentPaperColors()
})
</script>

<style>
.site-background {
  position: fixed;
  inset: 0;
  z-index: 0;
}

/* Plain in-flow content paints *before* any z-index:0 sibling regardless of
   DOM order (CSS stacking rules put non-positioned in-flow boxes below any
   element that establishes its own stacking context) — so .site-background
   at z-index:0 would otherwise render on top of ordinary page content. Lift
   the actual content into its own stacking context so it wins instead. */
.page-content {
  position: relative;
  z-index: 1;
}

.global-nav-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10; /* nav layer */
  padding: var(--space-sm) var(--space-xl);
  padding-bottom: max(var(--space-sm), env(safe-area-inset-bottom));
  border-top: 1px solid var(--line-soft);
  background: var(--bg);
}
.global-nav-wrapper .navbar {
  max-width: 1080px;
  margin: 0 auto;
}

@media (min-width: 40rem) {
  .global-nav-wrapper {
    position: static;
    padding: 28px clamp(24px, 5vw, 80px) 24px;
    border-top: none;
    border-bottom: 1px solid var(--line-soft);
    margin-bottom: 48px;
    background: transparent;
  }
}
</style>
