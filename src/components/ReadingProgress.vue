<template>
  <div class="progress-bar" :style="{ width: pct + '%' }" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const pct = ref(0)

function update() {
  const el = document.documentElement
  const scrolled = el.scrollTop || document.body.scrollTop
  const total = el.scrollHeight - el.clientHeight
  pct.value = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0
}

onMounted(() => window.addEventListener('scroll', update, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', update))
</script>

<style scoped>
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: var(--accent);
  z-index: 1000;
  transition: width 0.05s linear;
  pointer-events: none;
}
</style>
