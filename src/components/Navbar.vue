<template>
  <nav class="navbar">
    <router-link to="/" class="brand">G</router-link>
    <div class="right">
      <router-link to="/blog" class="nav-link" :class="{ active: current === 'blog' }">
        <span class="display-char">B</span><span class="mono-tail">log</span>
      </router-link>
      <router-link to="/timeline" class="nav-link" :class="{ active: current === 'timeline' }">
        <span class="display-char">T</span><span class="mono-tail">imeline</span>
      </router-link>
      <button
        class="theme-toggle"
        :class="theme"
        @click="toggle"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <span class="toggle-track">
          <span class="toggle-thumb" />
          <span class="toggle-icon moon">☽</span>
          <span class="toggle-icon sun">☀</span>
        </span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useTheme } from '../composables/useTheme.js'

defineProps({ current: String })

const { theme, toggle } = useTheme()
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-family: var(--display);
  font-size: 40px;
  line-height: 1;
  color: var(--fg);
  text-decoration: none;
  transition: color 0.15s var(--ease-out);
}
.brand:hover,
.brand:focus-visible { color: var(--accent); }

.right {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-link {
  display: inline-flex;
  align-items: baseline;
  text-decoration: none;
  color: var(--fg);
}

.display-char {
  font-family: var(--display);
  font-size: 40px;
  line-height: 1;
  transition: color 0.15s var(--ease-out);
}

.mono-tail {
  font-family: var(--mono);
  font-size: 18px;
  color: var(--fg-muted);
  transition: color 0.15s var(--ease-out);
}

/* Hover + focus: both chars go accent + underline on tail */
.nav-link:hover .display-char,
.nav-link:focus-visible .display-char,
.nav-link:hover .mono-tail,
.nav-link:focus-visible .mono-tail {
  color: var(--accent);
}
.nav-link:hover .mono-tail,
.nav-link:focus-visible .mono-tail {
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Active: accent color + underline on tail */
.nav-link.active .display-char {
  color: var(--accent);
}
.nav-link.active .mono-tail {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Theme toggle */
.theme-toggle {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.toggle-track {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 99px;
  border: 1.5px solid var(--line);
  background: var(--bg);
  display: flex;
  align-items: center;
  transition: background 0.25s var(--ease-in-out), border-color 0.25s var(--ease-in-out);
  overflow: hidden;
}
.theme-toggle.dark .toggle-track {
  background: var(--paper);
  border-color: var(--line);
}
.toggle-thumb {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--fg);
  left: 4px;
  transition: transform 0.25s var(--ease-in-out), background 0.25s var(--ease-in-out);
}
.theme-toggle.dark .toggle-thumb {
  transform: translateX(20px);
}
.toggle-icon {
  position: absolute;
  font-size: 10px;
  line-height: 1;
  transition: opacity 0.2s;
  pointer-events: none;
}
.toggle-icon.sun  { right: 5px; opacity: 0; }
.toggle-icon.moon { left: 5px;  opacity: 0; }
.theme-toggle.light .toggle-icon.sun  { opacity: 1; }
.theme-toggle.dark  .toggle-icon.moon { opacity: 1; }
</style>
