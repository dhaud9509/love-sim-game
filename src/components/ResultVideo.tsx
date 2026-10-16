import { useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import type { GameResult } from '../types'
import { badgeDataUrl } from '../badge'
import { tierProfiles, categoryLabels } from '../data/tiers'
import { loadImage, roundRect, clamp01, hexToRgba } from '../canvasUtils'

interface ResultVideoProps {
  result: GameResult
}

const WIDTH = 540
const HEIGHT = 960
const BADGE_CENTER = { x: WIDTH / 2, y: 360 }
const BADGE_RADIUS = 110
const DURATION = 5

type Status = 'idle' | 'recording' | 'done' | 'unsupported'

const MIME_CANDIDATES = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4']

function pickMimeType(): string | null {
  if (typeof MediaRecorder === 'undefined') return null
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) ?? null
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3)
}

function easeOutBack(x: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

function fadeSlideIn(t: number, start: number, duration: number): { alpha: number; dy: number } {
  const p = clamp01((t - start) / duration)
  const eased = easeOutCubic(p)
  return { alpha: eased, dy: (1 - eased) * 14 }
}

const TIMELINE = {
  badgePop: 0.35,
  eyebrowFade: 0.3,
  badgeEntrance: 0.6,
  badgeFade: 0.4,
  headline: 0.5,
  tagline: 0.8,
  textFadeDuration: 0.45,
  countStart: 1.6,
  countDuration: 1.2,
  countFadeDuration: 0.4,
  hashtag: 2.4,
  burstStart: 2.8,
  burstDuration: 1.0,
  shineOffset: 0.9,
  shinePeriod: 2.3,
  shineWindow: 0.35,
}

export function ResultVideo({ result }: ResultVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)

  useEffect(() => {
    if (pickMimeType() === null) setStatus('unsupported')
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleGenerate() {
    const canvas = canvasRef.current
    const mimeType = pickMimeType()
    if (!canvas || !mimeType) {
      setStatus('unsupported')
      return
    }
    const context = canvas.getContext('2d')
    if (!context) return
    const ctx = context

    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoUrl(null)
    setVideoBlob(null)
    setProgress(0)
    setStatus('recording')

    const badgeImg = await loadImage(badgeDataUrl(result.tier))

    const stream = canvas.captureStream(30)
    const chunks: BlobPart[] = []
    const recorder = new MediaRecorder(stream, { mimeType })
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType })
      setVideoBlob(blob)
      setVideoUrl(URL.createObjectURL(blob))
      setStatus('done')
      track('video_generated', { tier: result.tier })
    }

    recorder.start()
    const startTime = performance.now()

    function tick(now: number) {
      const t = (now - startTime) / 1000
      drawFrame(ctx, result, badgeImg, t)
      setProgress(clamp01(t / DURATION))
      if (t < DURATION) {
        requestAnimationFrame(tick)
      } else {
        recorder.stop()
      }
    }
    requestAnimationFrame(tick)
  }

  function handleDownload() {
    if (!videoUrl) return
    const link = document.createElement('a')
    link.download = `wealth-test-video-${result.tier}.webm`
    link.href = videoUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    track('video_download', { tier: result.tier })
  }

  async function handleShare() {
    if (!videoBlob) return
    try {
      const file = new File([videoBlob], `wealth-test-video-${result.tier}.webm`, { type: videoBlob.type })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: '재력 백분위 테스트',
          text: `상위 ${result.overallPercentile}%, '${result.tier}'가 나왔어!`,
        })
        track('video_share', { tier: result.tier })
      }
    } catch {
      // user cancelled or share unsupported — the download button already covers this case
    }
  }

  return (
    <div className="video-card">
      <p className="video-title">결과 영상</p>

      {status === 'unsupported' && (
        <p className="video-note">이 브라우저에서는 영상 생성을 지원하지 않아요. 최신 Chrome, Edge, Safari에서 시도해보세요.</p>
      )}

      {status !== 'unsupported' && (
        <>
          <div className="video-frame" style={{ display: status === 'done' ? 'none' : 'block' }}>
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="video-canvas" />
          </div>

          {status === 'done' && videoUrl && (
            <video ref={videoRef} className="video-canvas" src={videoUrl} controls loop playsInline />
          )}

          {status === 'recording' && (
            <div className="video-progress-bar">
              <div className="video-progress-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
          )}

          {status === 'idle' && (
            <button className="primary-button" onClick={handleGenerate}>
              ✨ 영상 만들기
            </button>
          )}

          {status === 'recording' && <p className="video-note">영상을 생성하는 중이에요...</p>}

          {status === 'done' && (
            <div className="share-actions-row">
              <button className="secondary-button" onClick={handleDownload}>
                영상 다운로드
              </button>
              <button className="secondary-button" onClick={handleShare}>
                공유하기
              </button>
            </div>
          )}

          {status === 'done' && (
            <button className="link-button" onClick={handleGenerate}>
              다시 만들기
            </button>
          )}
        </>
      )}
    </div>
  )
}

function drawFrame(ctx: CanvasRenderingContext2D, result: GameResult, badgeImg: HTMLImageElement, t: number) {
  const { tier, overallPercentile, strongest, weakest } = result
  const profile = tierProfiles[tier]

  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  gradient.addColorStop(0, profile.gradient[0])
  gradient.addColorStop(1, profile.gradient[1])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.textAlign = 'center'

  ctx.save()
  ctx.globalAlpha = easeOutCubic(clamp01(t / TIMELINE.eyebrowFade))
  ctx.font = '600 20px system-ui, sans-serif'
  ctx.fillText('재력 백분위 테스트', WIDTH / 2, 70)
  ctx.restore()

  ctx.save()
  const badgeP = easeOutBack(clamp01(t / TIMELINE.badgePop))
  ctx.translate(WIDTH / 2, 113)
  ctx.scale(badgeP, badgeP)
  ctx.translate(-WIDTH / 2, -113)
  roundRect(ctx, WIDTH / 2 - 44, 96, 88, 34, 17)
  ctx.fillStyle = 'rgba(255,255,255,0.22)'
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = '700 18px system-ui, sans-serif'
  ctx.fillText(tier, WIDTH / 2, 119)
  ctx.restore()

  drawSparkles(ctx, t)
  drawBurst(ctx, t, profile.gradient[0])

  const breatheT = Math.max(0, t - TIMELINE.badgeEntrance)
  const bob = Math.sin(breatheT * 2) * 5
  const breathScale = 1 + Math.sin(breatheT * 2) * 0.015
  const entranceScale = easeOutBack(clamp01(t / TIMELINE.badgeEntrance))
  const badgeAlpha = easeOutCubic(clamp01(t / TIMELINE.badgeFade))
  const scale = entranceScale * breathScale

  ctx.save()
  ctx.globalAlpha = badgeAlpha
  ctx.translate(BADGE_CENTER.x, BADGE_CENTER.y + bob)
  ctx.scale(scale, scale)
  ctx.beginPath()
  ctx.arc(0, 0, BADGE_RADIUS, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.fill()
  ctx.clip()
  ctx.drawImage(badgeImg, -BADGE_RADIUS, -BADGE_RADIUS, BADGE_RADIUS * 2, BADGE_RADIUS * 2)

  const shinePhase = (t - TIMELINE.shineOffset) % TIMELINE.shinePeriod
  if (shinePhase >= 0 && shinePhase < TIMELINE.shineWindow) {
    const sweepP = shinePhase / TIMELINE.shineWindow
    const sweepX = -BADGE_RADIUS * 1.6 + sweepP * BADGE_RADIUS * 3.2
    ctx.save()
    ctx.rotate(-0.5)
    const shine = ctx.createLinearGradient(sweepX - 22, 0, sweepX + 22, 0)
    shine.addColorStop(0, 'rgba(255,255,255,0)')
    shine.addColorStop(0.5, 'rgba(255,255,255,0.6)')
    shine.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = shine
    ctx.fillRect(-BADGE_RADIUS * 2, -BADGE_RADIUS * 2, BADGE_RADIUS * 4, BADGE_RADIUS * 4)
    ctx.restore()
  }
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = badgeAlpha
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(BADGE_CENTER.x, BADGE_CENTER.y + bob, BADGE_RADIUS * scale, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  ctx.fillStyle = 'rgba(255,255,255,0.92)'

  const countStartValue = Math.min(92, overallPercentile + 35)
  const countP = easeOutCubic(clamp01((t - TIMELINE.countStart) / TIMELINE.countDuration))
  const shownPercentile = Math.round((countStartValue - (countStartValue - overallPercentile) * countP) * 10) / 10
  const countPunch =
    countP >= 1 ? 1 + Math.max(0, 1 - (t - TIMELINE.countStart - TIMELINE.countDuration) / 0.25) * 0.1 : 1

  const headlineAnim = fadeSlideIn(t, TIMELINE.headline, TIMELINE.textFadeDuration)
  ctx.save()
  ctx.globalAlpha = headlineAnim.alpha
  ctx.translate(WIDTH / 2, BADGE_CENTER.y + BADGE_RADIUS + 78 + headlineAnim.dy)
  ctx.scale(countPunch, countPunch)
  ctx.font = '800 54px system-ui, sans-serif'
  ctx.fillText(`상위 ${shownPercentile}%`, 0, 0)
  ctx.restore()

  const taglineAnim = fadeSlideIn(t, TIMELINE.tagline, TIMELINE.textFadeDuration)
  ctx.save()
  ctx.globalAlpha = taglineAnim.alpha
  ctx.translate(0, taglineAnim.dy)
  const taglineEndY = wrapText(ctx, profile.tagline, WIDTH / 2, BADGE_CENTER.y + BADGE_RADIUS + 130, WIDTH - 110, 30)
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = clamp01((t - TIMELINE.countStart) / TIMELINE.countFadeDuration)
  ctx.font = '500 20px system-ui, sans-serif'
  ctx.fillText(
    `강점 ${categoryLabels[strongest.category]} · 약점 ${categoryLabels[weakest.category]}`,
    WIDTH / 2,
    taglineEndY + 44,
  )
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = clamp01((t - TIMELINE.hashtag) / 0.5)
  ctx.font = '400 15px system-ui, sans-serif'
  ctx.fillText('#재력백분위테스트 #수저계급', WIDTH / 2, HEIGHT - 40)
  ctx.restore()
}

function drawSparkles(ctx: CanvasRenderingContext2D, t: number) {
  const count = 8
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + t * 0.3
    const radiusWobble = BADGE_RADIUS + 30 + Math.sin(t * 1.5 + i) * 14
    const x = BADGE_CENTER.x + Math.cos(angle) * radiusWobble
    const y = BADGE_CENTER.y + Math.sin(angle) * radiusWobble * 0.9
    const twinkle = (Math.sin(t * 2 + i * 1.3) + 1) / 2
    ctx.beginPath()
    ctx.arc(x, y, 2.5 + twinkle * 2, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${0.15 + twinkle * 0.35})`
    ctx.fill()
  }
}

function drawBurst(ctx: CanvasRenderingContext2D, t: number, tintHex: string) {
  const progress = clamp01((t - TIMELINE.burstStart) / TIMELINE.burstDuration)
  if (progress <= 0 || progress >= 1) return

  const eased = easeOutCubic(progress)
  const fade = 1 - progress
  const count = 12

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (i % 2 === 0 ? 0.12 : -0.12)
    const dist = eased * 80
    const x = BADGE_CENTER.x + Math.cos(angle) * (BADGE_RADIUS + 14 + dist)
    const y = BADGE_CENTER.y + Math.sin(angle) * (BADGE_RADIUS + 14 + dist) * 0.9
    const size = 2 + (1 - progress) * 3.5
    const useTint = i % 3 === 0

    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = useTint ? hexToRgba(tintHex, fade * 0.85) : `rgba(255,255,255,${fade * 0.85})`
    ctx.fill()
  }
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
