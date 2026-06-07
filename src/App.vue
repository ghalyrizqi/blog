<template>
  <div class="global-nav-wrapper">
    <Navbar :current="currentPage" />
  </div>
  <RouterView />
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()

const currentPage = computed(() => {
  const name = route.name
  if (name === 'blog' || name === 'post') return 'blog'
  if (name === 'timeline') return 'timeline'
  return 'home'
})
</script>

<style>
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
