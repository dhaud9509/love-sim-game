import { useEffect, useRef } from 'react'
import type { CategoryResult } from '../types'
import { categoryLabels } from '../data/tiers'
import { drawRadarChart } from '../radarChart'

interface RadarChartProps {
  categories: CategoryResult[]
  color: string
  size?: number
}

export function RadarChart({ categories, color, size = 260 }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, size, size)
    drawRadarChart(
      ctx,
      categories.map((c) => ({ label: categoryLabels[c.category], value: Math.max(0, 1 - c.percentile / 100) })),
      { centerX: size / 2, centerY: size / 2, radius: size * 0.32, color },
    )
  }, [categories, color, size])

  return <canvas ref={canvasRef} width={size} height={size} className="radar-canvas" />
}
