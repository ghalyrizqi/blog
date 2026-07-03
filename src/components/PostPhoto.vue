<script setup>
import { computed } from 'vue'
import FlutedGlass from './FlutedGlass.vue'
import { usePostPhoto } from '../composables/usePostPhoto.js'

const props = defineProps({
  slug: { type: String, required: true },
  title: { type: String, default: '' },
  preset: { type: String, default: 'default' },
})

// Paper Design's "Abstract" FlutedGlass preset — a coarser, more painterly
// distortion than the library defaults, for a page-level hero rather than
// per-post imagery.
const PRESETS = {
  default: {},
  abstract: {
    size: 0.7,
    shadows: 0,
    highlights: 0,
    shape: 'linesIrregular',
    angle: 30,
    distortionShape: 'flat',
    distortion: 1,
    shift: 0,
    stretch: 1,
    blur: 1,
    edges: 0.5,
    margin: 0,
    grainMixer: 0.1,
    grainOverlay: 0.1,
    scale: 4,
    fit: 'cover',
  },
}

const { photo, error, rerollLimited, reroll } = usePostPhoto(() => props.slug)

const creditProfileUrl = computed(() =>
  photo.value ? `${photo.value.profileUrl}?utm_source=the_second_brain&utm_medium=referral` : ''
)
const creditUnsplashUrl = 'https://unsplash.com/?utm_source=the_second_brain&utm_medium=referral'
</script>

<template>
  <div class="post-photo" role="img" :aria-label="title">
    <FlutedGlass v-if="photo" :image="photo.url" v-bind="PRESETS[preset]" />
    <button
      v-else-if="error"
      class="photo-retry"
      type="button"
      :disabled="rerollLimited"
      @click="reroll"
    >
      {{ rerollLimited ? "Couldn't load photo" : "Couldn't load photo — retry" }}
    </button>
    <div v-if="photo" class="photo-chrome">
      <span class="photo-credit">
        Photo by <a :href="creditProfileUrl" target="_blank" rel="noopener noreferrer">{{ photo.name }}</a> on
        <a :href="creditUnsplashUrl" target="_blank" rel="noopener noreferrer">Unsplash</a>
      </span>
      <button
        class="photo-reroll"
        type="button"
        :disabled="rerollLimited"
        :title="rerollLimited ? 'Reroll limit reached — try again later' : 'Choose another photo'"
        :aria-label="rerollLimited ? 'Reroll limit reached' : 'Choose another photo'"
        @click="reroll"
      >⟳</button>
    </div>
  </div>
</template>

<style scoped>
.post-photo {
  position: absolute;
  inset: 0;
}

.photo-retry {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--fg-subtle);
  cursor: pointer;
}
.photo-retry:hover { color: var(--fg-muted); }
.photo-retry:disabled { cursor: default; }
.photo-retry:disabled:hover { color: var(--fg-subtle); }

.photo-chrome {
  position: absolute;
  right: 10px;
  bottom: 8px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.15s var(--ease-out);
}

.post-photo:hover .photo-chrome {
  opacity: 1;
}

.photo-credit {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  text-decoration: none;
}
.photo-credit a {
  color: inherit;
  text-decoration: underline;
}

.photo-reroll {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s var(--ease-out), transform 0.15s var(--ease-out);
}
.photo-reroll:hover {
  background: rgba(0, 0, 0, 0.65);
  transform: rotate(45deg);
}
.photo-reroll:disabled {
  cursor: default;
  opacity: 0.4;
}
.photo-reroll:disabled:hover {
  background: rgba(0, 0, 0, 0.45);
  transform: none;
}
</style>
