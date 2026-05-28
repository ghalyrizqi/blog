<template>
  <div v-if="showGlobalNav" class="global-nav-wrapper">
    <Navbar :current="currentPage" />
  </div>
  <RouterView />
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()

// BlogPost has its own sticky nav — hide the global one there
const showGlobalNav = computed(() => route.name !== 'post')

const currentPage = computed(() => {
  const name = route.name
  if (name === 'blog' || name === 'post') return 'blog'
  if (name === 'timeline') return 'timeline'
  return 'home'
})
</script>

<style>
.global-nav-wrapper {
  padding: 28px clamp(24px, 5vw, 80px) 24px;
  border-bottom: 1px solid var(--line-soft);
  margin-bottom: 48px;
}
.global-nav-wrapper .navbar {
  max-width: 1080px;
  margin: 0 auto;
}
</style>
