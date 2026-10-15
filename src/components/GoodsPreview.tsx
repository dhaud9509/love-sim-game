import { useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import type { GameResult } from '../types'
import { portraitDataUrl } from '../portrait'
import { loadImage, roundRect } from '../canvasUtils'

interface GoodsPreviewProps {
  result: GameResult
}

const SIZE = 480

type Product = 'case' | 'sticker' | 'mug'

const PRODUCT_LABELS: Record<Product, string> = {
  case: '폰케이스',
  sticker: '스티커',
  mug: '머그컵',
}

export function GoodsPreview({ result }: GoodsPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [product, setProduct] = useState<Product>('case')
  const [portraitImg, setPortraitImg] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    let cancelled = false
    loadImage(portraitDataUrl({ vibe: result.character.vibe, trait: result.character.trait })).then((img) => {
      if (!cancelled) setPortraitImg(img)
    })
    return () => {
      cancelled = true
    }
  }, [result])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !portraitImg) return

    ctx.clearRect(0, 0, SIZE, SIZE)
    if (product === 'case') drawPhoneCase(ctx, result, portraitImg)
    if (product === 'sticker') drawStickerSheet(ctx, result, portraitImg)
    if (product === 'mug') drawMug(ctx, result, portraitImg)
  }, [product, portraitImg, result])

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `love-sim-goods-${product}-${result.character.key}.png`
    link.href = canvas.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    track('goods_mockup_download', { character: result.character.key, product })
  }

  return (
    <div className="goods-card">
      <p className="video-title">굿즈 미리보기</p>

      <div className="goods-tabs">
        {(Object.keys(PRODUCT_LABELS) as Product[]).map((key) => (
          <button
            key={key}
            className={`goods-tab ${product === key ? 'active' : ''}`}
            onClick={() => setProduct(key)}
          >
            {PRODUCT_LABELS[key]}
          </button>
        ))}
      </div>

      <canvas ref={canvasRef} width={SIZE} height={SIZE} className="goods-canvas" />

      <button className="secondary-button" onClick={handleDownload}>
        목업 이미지 저장
      </button>

      <p className="video-note">* 실제 주문·결제 기능은 준비 중입니다. 출시되면 가장 먼저 알려드릴게요!</p>
    </div>
  )
}

function drawPhoneCase(ctx: CanvasRenderingContext2D, result: GameResult, portrait: HTMLImageElement) {
  const { character } = result

  ctx.fillStyle = '#f3f1f6'
  ctx.fillRect(0, 0, SIZE, SIZE)

  roundRect(ctx, 130, 40, 220, 400, 40)
  ctx.fillStyle = '#2b2b36'
  ctx.fill()

  const gradient = ctx.createLinearGradient(0, 40, 0, 440)
  gradient.addColorStop(0, character.gradient[0])
  gradient.addColorStop(1, character.gradient[1])
  roundRect(ctx, 140, 50, 200, 380, 34)
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.beginPath()
  ctx.arc(240, 78, 12, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.fill()

  const portraitRadius = 70
  const portraitY = 220
  ctx.save()
  ctx.beginPath()
  ctx.arc(240, portraitY, portraitRadius, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.fill()
  ctx.clip()
  ctx.drawImage(portrait, 240 - portraitRadius, portraitY - portraitRadius, portraitRadius * 2, portraitRadius * 2)
  ctx.restore()

  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(240, portraitY, portraitRadius, 0, Math.PI * 2)
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.font = '800 26px system-ui, sans-serif'
  ctx.fillText(character.name, 240, 320)

  ctx.font = '500 13px system-ui, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.fillText('80억분의 1 · 연애 시뮬레이션', 240, 400)
}

function drawStickerSheet(ctx: CanvasRenderingContext2D, result: GameResult, portrait: HTMLImageElement) {
  const { character } = result

  ctx.fillStyle = '#e9e7ee'
  ctx.fillRect(0, 0, SIZE, SIZE)

  roundRect(ctx, 50, 50, 380, 380, 20)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'
  ctx.lineWidth = 1
  ctx.stroke()

  const stickers: Array<{ x: number; y: number; r: number; rotate: number }> = [
    { x: 175, y: 175, r: 80, rotate: -0.08 },
    { x: 350, y: 150, r: 58, rotate: 0.18 },
    { x: 260, y: 335, r: 64, rotate: -0.12 },
  ]

  for (const s of stickers) {
    ctx.save()
    ctx.translate(s.x, s.y)
    ctx.rotate(s.rotate)

    ctx.beginPath()
    ctx.arc(0, 0, s.r + 7, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(0,0,0,0.15)'
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.shadowBlur = 0

    ctx.save()
    ctx.beginPath()
    ctx.arc(0, 0, s.r, 0, Math.PI * 2)
    ctx.closePath()
    const gradient = ctx.createLinearGradient(-s.r, -s.r, s.r, s.r)
    gradient.addColorStop(0, character.gradient[0])
    gradient.addColorStop(1, character.gradient[1])
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.clip()
    ctx.drawImage(portrait, -s.r, -s.r, s.r * 2, s.r * 2)
    ctx.restore()

    ctx.restore()
  }

  for (const [hx, hy, size] of [[110, 330, 16], [380, 310, 12], [150, 90, 10]] as const) {
    ctx.save()
    ctx.translate(hx, hy)
    ctx.beginPath()
    ctx.moveTo(0, size * 0.3)
    ctx.bezierCurveTo(-size, -size * 0.6, -size * 0.3, -size, 0, -size * 0.2)
    ctx.bezierCurveTo(size * 0.3, -size, size, -size * 0.6, 0, size * 0.3)
    ctx.closePath()
    ctx.fillStyle = character.gradient[0]
    ctx.fill()
    ctx.restore()
  }
}

function drawMug(ctx: CanvasRenderingContext2D, result: GameResult, portrait: HTMLImageElement) {
  const { character } = result

  ctx.fillStyle = '#efeef2'
  ctx.fillRect(0, 0, SIZE, SIZE)

  ctx.beginPath()
  ctx.ellipse(245, 410, 110, 18, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.1)'
  ctx.fill()

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(350, 180)
  ctx.bezierCurveTo(410, 180, 410, 280, 350, 280)
  ctx.lineWidth = 16
  ctx.strokeStyle = '#ffffff'
  ctx.stroke()
  ctx.restore()

  roundRect(ctx, 140, 120, 210, 280, 14)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'
  ctx.stroke()

  const gradient = ctx.createLinearGradient(140, 190, 350, 320)
  gradient.addColorStop(0, character.gradient[0])
  gradient.addColorStop(1, character.gradient[1])
  roundRect(ctx, 140, 190, 210, 130, 4)
  ctx.fillStyle = gradient
  ctx.fill()

  const portraitRadius = 42
  ctx.save()
  ctx.beginPath()
  ctx.arc(245, 255, portraitRadius, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.fill()
  ctx.clip()
  ctx.drawImage(portrait, 245 - portraitRadius, 255 - portraitRadius, portraitRadius * 2, portraitRadius * 2)
  ctx.restore()

  ctx.strokeStyle = 'rgba(255,255,255,0.8)'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(245, 255, portraitRadius, 0, Math.PI * 2)
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 18px system-ui, sans-serif'
  ctx.fillText(character.name, 245, 310)

  ctx.fillStyle = 'rgba(43,43,54,0.7)'
  ctx.font = '500 13px system-ui, sans-serif'
  ctx.fillText('80억분의 1 · 연애 시뮬레이션', 245, 150)
}
