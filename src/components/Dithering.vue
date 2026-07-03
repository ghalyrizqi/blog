<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  ShaderMount,
  ditheringFragmentShader,
  DitheringShapes,
  DitheringTypes,
  ShaderFitOptions,
  getShaderColorFromString,
} from '@paper-design/shaders'

const props = defineProps({
  colorBack: { type: String, default: '#000000' },
  colorFront: { type: String, default: '#00b2ff' },
  shape: { type: String, default: 'sphere' },
  type: { type: String, default: '4x4' },
  size: { type: Number, default: 2 },
  speed: { type: Number, default: 1 },
  fit: { type: String, default: 'none' },
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

// getShaderColorFromString only understands #hex/rgb()/hsl() — resolve
// anything else (CSS custom properties, oklch(), etc.) by letting the
// browser's own color engine parse it, then rasterizing through a 1x1
// canvas to force it down to concrete sRGB bytes (getComputedStyle alone
// can hand back the value still in oklch()/lab() form, which the shader
// color parser doesn't understand either).
function resolveCssColor(value) {
  if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) return value
  const probe = document.createElement('div')
  probe.style.display = 'none'
  probe.style.color = value
  document.body.appendChild(probe)
  const computed = getComputedStyle(probe).color
  document.body.removeChild(probe)

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = computed
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`
}

function buildUniforms() {
  return {
    u_colorBack: getShaderColorFromString(resolveCssColor(props.colorBack)),
    u_colorFront: getShaderColorFromString(resolveCssColor(props.colorFront)),
    u_shape: DitheringShapes[props.shape],
    u_type: DitheringTypes[props.type],
    u_pxSize: props.size,
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

onMounted(() => {
  mount = new ShaderMount(el.value, ditheringFragmentShader, buildUniforms(), undefined, props.speed)
})

watch(
  () => ({ ...props }),
  () => mount?.setUniforms(buildUniforms()),
  { deep: true }
)

onUnmounted(() => mount?.dispose())
</script>

<template>
  <div ref="el" class="dithering" />
</template>

<style scoped>
.dithering {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
