<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  ShaderMount,
  paperTextureFragmentShader,
  ShaderFitOptions,
  getShaderColorFromString,
  getShaderNoiseTexture,
  emptyPixel,
} from '@paper-design/shaders'
import { resolveCssColor } from '../lib/resolveCssColor.js'

const props = defineProps({
  image: { type: String, default: '' },
  colorFront: { type: String, default: '#9fadbc' },
  colorBack: { type: String, default: '#ffffff' },
  contrast: { type: Number, default: 0.3 },
  roughness: { type: Number, default: 0.4 },
  fiber: { type: Number, default: 0.3 },
  fiberSize: { type: Number, default: 0.2 },
  crumples: { type: Number, default: 0.3 },
  crumpleSize: { type: Number, default: 0.35 },
  folds: { type: Number, default: 0.65 },
  foldCount: { type: Number, default: 5 },
  fade: { type: Number, default: 0 },
  drops: { type: Number, default: 0.2 },
  seed: { type: Number, default: 5.8 },
  speed: { type: Number, default: 0 },
  fit: { type: String, default: 'cover' },
  scale: { type: Number, default: 0.6 },
  rotation: { type: Number, default: 0 },
  originX: { type: Number, default: 0.5 },
  originY: { type: Number, default: 0.5 },
  offsetX: { type: Number, default: 0 },
  offsetY: { type: Number, default: 0 },
  worldWidth: { type: Number, default: 0 },
  worldHeight: { type: Number, default: 0 },
})

const el = ref(null)
let mount = null

// Both u_image and u_noiseTexture are texture uniforms — ShaderMount needs
// them already loaded as real HTMLImageElements before construction (see
// FlutedGlass.vue / the old GrainGradient.vue for the same issue). There's
// no source photo here, so u_image just resolves to a 1x1 transparent pixel
// (mirroring how the React wrapper defaults an empty `image` prop).
function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    if (url.startsWith('http')) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.src = url
  })
}

let noiseTexturePromise = null
function loadNoiseTexture() {
  if (!noiseTexturePromise) {
    noiseTexturePromise = new Promise((resolve) => {
      const img = getShaderNoiseTexture()
      if (!img || (img.complete && img.naturalWidth > 0)) {
        resolve(img)
        return
      }
      img.onload = () => resolve(img)
      img.onerror = () => resolve(img)
    })
  }
  return noiseTexturePromise
}

function buildUniforms(image, noiseTexture) {
  return {
    u_image: image,
    u_noiseTexture: noiseTexture,
    u_colorFront: getShaderColorFromString(resolveCssColor(props.colorFront)),
    u_colorBack: getShaderColorFromString(resolveCssColor(props.colorBack)),
    u_contrast: props.contrast,
    u_roughness: props.roughness,
    u_fiber: props.fiber,
    u_fiberSize: props.fiberSize,
    u_crumples: props.crumples,
    u_crumpleSize: props.crumpleSize,
    u_foldCount: props.foldCount,
    u_folds: props.folds,
    u_fade: props.fade,
    u_drops: props.drops,
    u_seed: props.seed,
    u_fit: ShaderFitOptions[props.fit],
    u_scale: props.scale,
    u_rotation: props.rotation,
    u_offsetX: props.offsetX,
    u_offsetY: props.offsetY,
    u_originX: props.originX,
    u_originY: props.originY,
    u_worldWidth: props.worldWidth,
    u_worldHeight: props.worldHeight,
  }
}

let currentImage
let currentNoiseTexture

onMounted(async () => {
  ;[currentImage, currentNoiseTexture] = await Promise.all([
    loadImage(props.image || emptyPixel),
    loadNoiseTexture(),
  ])
  mount = new ShaderMount(
    el.value,
    paperTextureFragmentShader,
    buildUniforms(currentImage, currentNoiseTexture),
    undefined,
    props.speed,
    0,
    undefined,
    undefined,
    ['u_image']
  )
})

watch(
  () => props.image,
  async (url) => {
    currentImage = await loadImage(url || emptyPixel)
    mount?.setUniforms(buildUniforms(currentImage, currentNoiseTexture))
  }
)

watch(
  () => ({ ...props }),
  () => mount?.setUniforms(buildUniforms(currentImage, currentNoiseTexture)),
  { deep: true }
)

onUnmounted(() => mount?.dispose())
</script>

<template>
  <div ref="el" class="paper-texture" />
</template>

<style scoped>
.paper-texture {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
