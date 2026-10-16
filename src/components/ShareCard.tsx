import { useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import type { GameResult } from '../types'
import { badgeDataUrl } from '../badge'
import { tierProfiles, categoryLabels } from '../data/tiers'
import { drawRadarChart } from '../radarChart'
import { formatCount } from '../format'

interface ShareCardProps {
  result: GameResult
  shareUrl: string
}

const WIDTH = 600
const HEIGHT = 900
const BADGE_CENTER_Y = 230
const BADGE_RADIUS = 80

type CopyStatus = 'idle' | 'copied' | 'error'

export function ShareCard({ result, shareUrl }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let cancelled = false
    const badge = new Image()
    badge.onload = () => {
      if (!cancelled) draw(ctx, result, badge)
    }
    badge.src = badgeDataUrl(result.tier)

    return () => {
      cancelled = true
    }
  }, [result])

  function flashCopyStatus(status: CopyStatus) {
    setCopyStatus(status)
    setTimeout(() => setCopyStatus('idle'), 2000)
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      flashCopyStatus('copied')
      track('share_copy_link', { tier: result.tier })
    } catch {
      flashCopyStatus('error')
    }
  }

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `wealth-test-result-${result.tier}.png`
    link.href = canvas.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    track('share_download_image', { tier: result.tier })
  }

  async function handleShare() {
    const shareText = `나는 전 세계 80억 명 중 약 ${formatCount(result.worldRank.rank)}등(상위 ${result.overallPercentile}%) · '${result.tier}'가 나왔어! 너는 몇 등일까?`
    const canvas = canvasRef.current

    if (navigator.share) {
      try {
        if (canvas && navigator.canShare) {
          const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
          if (blob) {
            const file = new File([blob], `wealth-test-result-${result.tier}.png`, { type: 'image/png' })
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({ files: [file], title: '재력 백분위 테스트', text: shareText, url: shareUrl })
              track('share_native', { tier: result.tier })
              return
            }
          }
        }
        await navigator.share({ title: '재력 백분위 테스트', text: shareText, url: shareUrl })
        track('share_native', { tier: result.tier })
        return
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return
      }
    }

    await handleCopyLink()
  }

  return (
    <div className="share-card">
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="share-canvas" />
      <button className="primary-button" onClick={handleShare}>
        공유하기
      </button>
      <div className="share-actions-row">
        <button className="secondary-button" onClick={handleDownload}>
          이미지 저장
        </button>
        <button className="secondary-button" onClick={handleCopyLink}>
          링크 복사
        </button>
      </div>
      {copyStatus === 'copied' && <p className="copy-feedback">링크가 복사되었습니다</p>}
      {copyStatus === 'error' && <p className="copy-feedback error">복사에 실패했어요</p>}
    </div>
  )
}

function draw(ctx: CanvasRenderingContext2D, result: GameResult, badge: HTMLImageElement) {
  const { tier, overallPercentile, categories, strongest, weakest, worldRank } = result
  const profile = tierProfiles[tier]

  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  gradient.addColorStop(0, profile.gradient[0])
  gradient.addColorStop(1, profile.gradient[1])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.textAlign = 'center'

  ctx.font = '600 22px system-ui, sans-serif'
  ctx.fillText('재력 백분위 테스트', WIDTH / 2, 70)

  ctx.font = '700 26px system-ui, sans-serif'
  ctx.fillText(`[ ${tier} ]`, WIDTH / 2, 120)

  ctx.save()
  ctx.beginPath()
  ctx.arc(WIDTH / 2, BADGE_CENTER_Y, BADGE_RADIUS, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.fill()
  ctx.clip()
  ctx.drawImage(badge, WIDTH / 2 - BADGE_RADIUS, BADGE_CENTER_Y - BADGE_RADIUS, BADGE_RADIUS * 2, BADGE_RADIUS * 2)
  ctx.restore()

  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(WIDTH / 2, BADGE_CENTER_Y, BADGE_RADIUS, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = '500 18px system-ui, sans-serif'
  ctx.fillText('전 세계 80억 명 중', WIDTH / 2, BADGE_CENTER_Y + BADGE_RADIUS + 40)

  ctx.font = '800 48px system-ui, sans-serif'
  ctx.fillText(`약 ${formatCount(worldRank.rank)}등`, WIDTH / 2, BADGE_CENTER_Y + BADGE_RADIUS + 92)

  ctx.font = '700 22px system-ui, sans-serif'
  ctx.fillText(`상위 ${overallPercentile}%`, WIDTH / 2, BADGE_CENTER_Y + BADGE_RADIUS + 124)

  const taglineY = BADGE_CENTER_Y + BADGE_RADIUS + 160
  const taglineEndY = wrapText(ctx, profile.tagline, WIDTH / 2, taglineY, WIDTH - 140, 30)

  ctx.font = '500 18px system-ui, sans-serif'
  ctx.fillText(
    `강점 ${categoryLabels[strongest.category]} · 약점 ${categoryLabels[weakest.category]}`,
    WIDTH / 2,
    taglineEndY + 36,
  )

  const radarCenterY = taglineEndY + 200
  drawRadarChart(
    ctx,
    categories.map((c) => ({ label: categoryLabels[c.category], value: Math.max(0, 1 - c.percentile / 100) })),
    {
      centerX: WIDTH / 2,
      centerY: radarCenterY,
      radius: 128,
      color: '#ffffff',
      labelColor: 'rgba(255,255,255,0.92)',
      gridColor: 'rgba(255,255,255,0.3)',
      labelFont: '600 16px system-ui, sans-serif',
    },
  )

  ctx.font = '400 16px system-ui, sans-serif'
  ctx.fillText('#재력백분위테스트 #수저계급', WIDTH / 2, HEIGHT - 40)
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  ctx.font = '500 22px system-ui, sans-serif'
  const words = text.split(' ')
  let line = ''
  let offsetY = y

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, offsetY)
      line = word
      offsetY += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) ctx.fillText(line, x, offsetY)
  return offsetY
}
