// getShaderColorFromString (from @paper-design/shaders) only understands
// #hex/rgb()/hsl() — resolve anything else (CSS custom properties, oklch(),
// etc.) by letting the browser's own color engine parse it, then rasterizing
// through a 1x1 canvas to force it down to concrete sRGB bytes. Reading
// getComputedStyle alone isn't enough: it can hand the value back still in
// oklch()/lab() form, which the shader color parser doesn't understand either.
export function resolveCssColor(value) {
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
