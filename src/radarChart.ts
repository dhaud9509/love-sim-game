import { clamp01, hexToRgba } from './canvasUtils'

export interface RadarAxis {
  label: string
  value: number // 0 (center) to 1 (outer edge) — higher means a better percentile
}

export interface RadarChartOptions {
  centerX: number
  centerY: number
  radius: number
  color: string
  labelColor?: string
  gridColor?: string
  labelFont?: string
}

export function drawRadarChart(ctx: CanvasRenderingContext2D, axes: RadarAxis[], opts: RadarChartOptions) {
  const n = axes.length
  const angleStep = (Math.PI * 2) / n
  const startAngle = -Math.PI / 2
  const pointAt = (angle: number, r: number) => ({
    x: opts.centerX + Math.cos(angle) * r,
    y: opts.centerY + Math.sin(angle) * r,
  })

  const gridColor = opts.gridColor ?? 'rgba(255,255,255,0.18)'
  const rings = 4
  ctx.strokeStyle = gridColor
  ctx.lineWidth = 1
  for (let ring = 1; ring <= rings; ring++) {
    const ringRadius = (opts.radius * ring) / rings
    ctx.beginPath()
    for (let i = 0; i <= n; i++) {
      const { x, y } = pointAt(startAngle + angleStep * i, ringRadius)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  for (let i = 0; i < n; i++) {
    const { x, y } = pointAt(startAngle + angleStep * i, opts.radius)
    ctx.beginPath()
    ctx.moveTo(opts.centerX, opts.centerY)
    ctx.lineTo(x, y)
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    ctx.stroke()
  }

  ctx.beginPath()
  axes.forEach((axis, i) => {
    const { x, y } = pointAt(startAngle + angleStep * i, opts.radius * clamp01(axis.value))
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = hexToRgba(opts.color, 0.3)
  ctx.fill()
  ctx.strokeStyle = opts.color
  ctx.lineWidth = 2.5
  ctx.stroke()

  axes.forEach((axis, i) => {
    const { x, y } = pointAt(startAngle + angleStep * i, opts.radius * clamp01(axis.value))
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = opts.color
    ctx.fill()
  })

  ctx.fillStyle = opts.labelColor ?? 'rgba(255,255,255,0.92)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = opts.labelFont ?? '600 15px system-ui, sans-serif'
  axes.forEach((axis, i) => {
    const { x, y } = pointAt(startAngle + angleStep * i, opts.radius + 26)
    ctx.fillText(axis.label, x, y)
  })
}
