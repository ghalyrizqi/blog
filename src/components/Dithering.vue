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
import { resolveCssColor } from '../lib/resolveCssColor.js'

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
