<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  ShaderMount,
  flutedGlassFragmentShader,
  GlassDistortionShapes,
  GlassGridShapes,
  ShaderFitOptions,
  getShaderColorFromString,
} from '@paper-design/shaders'

const props = defineProps({
  image: { type: String, default: '' },
  colorBack: { type: String, default: '#00000000' },
  colorShadow: { type: String, default: '#000000' },
  colorHighlight: { type: String, default: '#ffffff' },
  shadows: { type: Number, default: 0.25 },
  size: { type: Number, default: 0.5 },
  angle: { type: Number, default: 0 },
  distortion: { type: Number, default: 0.5 },
  distortionShape: { type: String, default: 'prism' },
  highlights: { type: Number, default: 0.1 },
  shape: { type: String, default: 'lines' },
  shift: { type: Number, default: 0 },
  blur: { type: Number, default: 0 },
  edges: { type: Number, default: 0.25 },
  stretch: { type: Number, default: 0 },
  margin: { type: Number, default: 0 },
  marginLeft: { type: Number, default: undefined },
  marginRight: { type: Number, default: undefined },
  marginTop: { type: Number, default: undefined },
  marginBottom: { type: Number, default: undefined },
  grainMixer: { type: Number, default: 0 },
  grainOverlay: { type: Number, default: 0 },
  fit: { type: String, default: 'cover' },
  scale: { type: Number, default: 1 },
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
const loadedImage = ref(null)
let loadToken = 0

// The vanilla ShaderMount only accepts real HTMLImageElements for texture
// uniforms (unlike the React wrapper, which resolves URL strings for you).
// It also only registers the GL location for the `<name>AspectRatio`
// companion uniform at construction time, and only when the image is
// already a loaded HTMLImageElement — so the mount must be constructed
// with the image already resolved, not updated to it after the fact.
function loadImage(url) {
  const token = ++loadToken
  return new Promise((resolve) => {
    const img = new Image()
    if (url.startsWith('http')) img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (token !== loadToken) return
      // Upsample small images so the shader has enough texture detail to distort.
      if (img.naturalWidth < 1024 && img.naturalHeight < 1024 && img.naturalWidth >= 1 && img.naturalHeight >= 1) {
        const aspect = img.naturalWidth / img.naturalHeight
        img.width = Math.round(aspect > 1 ? 1024 * aspect : 1024)
        img.height = Math.round(aspect > 1 ? 1024 : 1024 / aspect)
      }
      resolve(img)
    }
    img.src = url
  })
}

function buildUniforms() {
  return {
    u_image: loadedImage.value ?? undefined,
    u_colorBack: getShaderColorFromString(props.colorBack),
    u_colorShadow: getShaderColorFromString(props.colorShadow),
    u_colorHighlight: getShaderColorFromString(props.colorHighlight),
    u_shadows: props.shadows,
    u_size: props.size,
    u_angle: props.angle,
    u_distortion: props.distortion,
    u_shift: props.shift,
    u_blur: props.blur,
    u_edges: props.edges,
    u_stretch: props.stretch,
    u_distortionShape: GlassDistortionShapes[props.distortionShape],
    u_highlights: props.highlights,
    u_shape: GlassGridShapes[props.shape],
    u_marginLeft: props.marginLeft ?? props.margin,
    u_marginRight: props.marginRight ?? props.margin,
    u_marginTop: props.marginTop ?? props.margin,
    u_marginBottom: props.marginBottom ?? props.margin,
    u_grainMixer: props.grainMixer,
    u_grainOverlay: props.grainOverlay,
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

onMounted(async () => {
  if (props.image) loadedImage.value = await loadImage(props.image)
  mount = new ShaderMount(
    el.value,
    flutedGlassFragmentShader,
    buildUniforms(),
    undefined,
    0,
    0,
    undefined,
    undefined,
    ['u_image']
  )
})

watch(() => props.image, async (url) => {
  if (url) loadedImage.value = await loadImage(url)
})

watch(
  [loadedImage, () => ({ ...props })],
  () => mount?.setUniforms(buildUniforms()),
  { deep: true }
)

onUnmounted(() => mount?.dispose())
</script>

<template>
  <div ref="el" class="fluted-glass" />
</template>

<style scoped>
.fluted-glass {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
