import { useEffect, useRef, useState } from 'react'
import type { GameResult } from '../types'
import { portraitDataUrl } from '../portrait'

interface ShareCardProps {
  result: GameResult
  shareUrl: string
}

const WIDTH = 600
const HEIGHT = 900
const PORTRAIT_CENTER_Y = 250
const PORTRAIT_RADIUS = 90

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
    const portrait = new Image()
    portrait.onload = () => {
      if (!cancelled) draw(ctx, result, portrait)
    }
    portrait.src = portraitDataUrl({ vibe: result.character.vibe, trait: result.character.trait })

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
    } catch {
      flashCopyStatus('error')
    }
  }

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `love-sim-result-${result.character.key}.png`
    link.href = canvas.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function handleShare() {
    const shareText = `나는 80억분의 1 중 '${result.character.name}'과(와) 매칭됐어! 너의 상대는 누구일까?`
    const canvas = canvasRef.current

    if (navigator.share) {
      try {
        if (canvas && navigator.canShare) {
          const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
          if (blob) {
            const file = new File([blob], `love-sim-result-${result.character.key}.png`, { type: 'image/png' })
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({ files: [file], title: '80억분의 1 · 연애 시뮬레이션', text: shareText, url: shareUrl })
              return
            }
          }
        }
        await navigator.share({ title: '80억분의 1 · 연애 시뮬레이션', text: shareText, url: shareUrl })
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

function draw(ctx: CanvasRenderingContext2D, result: GameResult, portrait: HTMLImageElement) {
  const { character, tier, matchCount, traitLabel, vibeLabel } = result

  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  gradient.addColorStop(0, character.gradient[0])
  gradient.addColorStop(1, character.gradient[1])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.textAlign = 'center'

  ctx.font = '600 22px system-ui, sans-serif'
  ctx.fillText('80억분의 1 · 연애 시뮬레이션', WIDTH / 2, 70)

  ctx.font = '700 26px system-ui, sans-serif'
  ctx.fillText(`[ ${tier} ]`, WIDTH / 2, 120)

  ctx.save()
  ctx.beginPath()
  ctx.arc(WIDTH / 2, PORTRAIT_CENTER_Y, PORTRAIT_RADIUS, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.fill()
  ctx.clip()
  ctx.drawImage(
    portrait,
    WIDTH / 2 - PORTRAIT_RADIUS,
    PORTRAIT_CENTER_Y - PORTRAIT_RADIUS,
    PORTRAIT_RADIUS * 2,
    PORTRAIT_RADIUS * 2,
  )
  ctx.restore()

  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(WIDTH / 2, PORTRAIT_CENTER_Y, PORTRAIT_RADIUS, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = '800 56px system-ui, sans-serif'
  ctx.fillText(character.name, WIDTH / 2, PORTRAIT_CENTER_Y + PORTRAIT_RADIUS + 70)

  ctx.font = '500 24px system-ui, sans-serif'
  ctx.fillText(
    `${vibeLabel} 분위기 · ${traitLabel} 성격`,
    WIDTH / 2,
    PORTRAIT_CENTER_Y + PORTRAIT_RADIUS + 108,
  )

  const taglineStartY = PORTRAIT_CENTER_Y + PORTRAIT_RADIUS + 160
  const taglineEndY = wrapText(ctx, character.tagline, WIDTH / 2, taglineStartY, WIDTH - 140, 34)

  ctx.font = 'italic 600 22px system-ui, sans-serif'
  ctx.fillText(`"${character.line}"`, WIDTH / 2, taglineEndY + 48)

  const matchCountY = taglineEndY + 130
  ctx.font = '700 32px system-ui, sans-serif'
  ctx.fillText(`지구에 단 ${matchCount.toLocaleString()}명`, WIDTH / 2, matchCountY)

  ctx.font = '400 20px system-ui, sans-serif'
  ctx.fillText('당신과 꼭 맞는 사람입니다', WIDTH / 2, matchCountY + 40)

  ctx.font = '400 16px system-ui, sans-serif'
  ctx.fillText('#80억분의1 #연애시뮬레이션', WIDTH / 2, HEIGHT - 40)
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  ctx.font = '500 24px system-ui, sans-serif'
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
