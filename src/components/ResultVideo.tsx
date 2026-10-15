import { useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import type { GameResult } from '../types'
import { portraitDataUrl } from '../portrait'
import { loadImage, roundRect } from '../canvasUtils'

interface ResultVideoProps {
  result: GameResult
}

const WIDTH = 540
const HEIGHT = 960
const PORTRAIT_CENTER = { x: WIDTH / 2, y: 360 }
const PORTRAIT_RADIUS = 110
const DURATION = 5

type Status = 'idle' | 'recording' | 'done' | 'unsupported'

const MIME_CANDIDATES = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4']

function pickMimeType(): string | null {
  if (typeof MediaRecorder === 'undefined') return null
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) ?? null
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
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
  portraitEntrance: 0.6,
  portraitFade: 0.4,
  name: 0.5,
  subline: 0.7,
  tagline: 0.9,
  quote: 1.3,
  textFadeDuration: 0.45,
  countStart: 1.9,
  countDuration: 1.0,
  countFadeDuration: 0.4,
  hashtag: 1.8,
  burstStart: 2.8,
  burstDuration: 1.0,
  blinkOffset: 0.9,
  blinkPeriod: 2.3,
  blinkWindow: 0.15,
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

    const [openImg, closedImg] = await Promise.all([
      loadImage(portraitDataUrl({ vibe: result.character.vibe, trait: result.character.trait })),
      loadImage(portraitDataUrl({ vibe: result.character.vibe, trait: result.character.trait, blink: true })),
    ])

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
      track('video_generated', { character: result.character.key })
    }

    recorder.start()
    const startTime = performance.now()

    function tick(now: number) {
      const t = (now - startTime) / 1000
      drawFrame(ctx, result, openImg, closedImg, t)
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
    link.download = `love-sim-video-${result.character.key}.webm`
    link.href = videoUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    track('video_download', { character: result.character.key })
  }

  async function handleShare() {
    if (!videoBlob) return
    try {
      const file = new File([videoBlob], `love-sim-video-${result.character.key}.webm`, { type: videoBlob.type })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: '80억분의 1 · 연애 시뮬레이션',
          text: `'${result.character.name}'과(와)의 매칭 영상이야!`,
        })
        track('video_share', { character: result.character.key })
      }
    } catch {
      // user cancelled or share unsupported — the download button already covers this case
    }
  }

  return (
    <div className="video-card">
      <p className="video-title">매칭 영상</p>

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

function drawFrame(
  ctx: CanvasRenderingContext2D,
  result: GameResult,
  openImg: HTMLImageElement,
  closedImg: HTMLImageElement,
  t: number,
) {
  const { character, tier, matchCount, traitLabel, vibeLabel } = result

  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  gradient.addColorStop(0, character.gradient[0])
  gradient.addColorStop(1, character.gradient[1])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.textAlign = 'center'

  ctx.save()
  ctx.globalAlpha = easeOutCubic(clamp01(t / TIMELINE.eyebrowFade))
  ctx.font = '600 20px system-ui, sans-serif'
  ctx.fillText('80억분의 1 · 연애 시뮬레이션', WIDTH / 2, 70)
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
  drawBurst(ctx, t, character.gradient[0])

  const breatheT = Math.max(0, t - TIMELINE.portraitEntrance)
  const bob = Math.sin(breatheT * 2) * 5
  const breathScale = 1 + Math.sin(breatheT * 2) * 0.015
  const entranceScale = easeOutBack(clamp01(t / TIMELINE.portraitEntrance))
  const portraitAlpha = easeOutCubic(clamp01(t / TIMELINE.portraitFade))
  const scale = entranceScale * breathScale

  const blinkPhase = (t - TIMELINE.blinkOffset) % TIMELINE.blinkPeriod
  const isBlinking = blinkPhase >= 0 && blinkPhase < TIMELINE.blinkWindow
  const portraitImg = isBlinking ? closedImg : openImg

  ctx.save()
  ctx.globalAlpha = portraitAlpha
  ctx.translate(PORTRAIT_CENTER.x, PORTRAIT_CENTER.y + bob)
  ctx.scale(scale, scale)
  ctx.beginPath()
  ctx.arc(0, 0, PORTRAIT_RADIUS, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.fill()
  ctx.clip()
  ctx.drawImage(portraitImg, -PORTRAIT_RADIUS, -PORTRAIT_RADIUS, PORTRAIT_RADIUS * 2, PORTRAIT_RADIUS * 2)
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = portraitAlpha
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(PORTRAIT_CENTER.x, PORTRAIT_CENTER.y + bob, PORTRAIT_RADIUS * scale, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  ctx.fillStyle = 'rgba(255,255,255,0.92)'

  const nameAnim = fadeSlideIn(t, TIMELINE.name, TIMELINE.textFadeDuration)
  ctx.save()
  ctx.globalAlpha = nameAnim.alpha
  ctx.translate(0, nameAnim.dy)
  ctx.font = '800 52px system-ui, sans-serif'
  ctx.fillText(character.name, WIDTH / 2, PORTRAIT_CENTER.y + PORTRAIT_RADIUS + 70)
  ctx.restore()

  const sublineAnim = fadeSlideIn(t, TIMELINE.subline, TIMELINE.textFadeDuration)
  ctx.save()
  ctx.globalAlpha = sublineAnim.alpha
  ctx.translate(0, sublineAnim.dy)
  ctx.font = '500 22px system-ui, sans-serif'
  ctx.fillText(`${vibeLabel} 분위기 · ${traitLabel} 성격`, WIDTH / 2, PORTRAIT_CENTER.y + PORTRAIT_RADIUS + 104)
  ctx.restore()

  const taglineY = PORTRAIT_CENTER.y + PORTRAIT_RADIUS + 150
  const taglineAnim = fadeSlideIn(t, TIMELINE.tagline, TIMELINE.textFadeDuration)
  ctx.save()
  ctx.globalAlpha = taglineAnim.alpha
  ctx.translate(0, taglineAnim.dy)
  const taglineEndY = wrapText(ctx, character.tagline, WIDTH / 2, taglineY, WIDTH - 120, 32)
  ctx.restore()

  const quoteAnim = fadeSlideIn(t, TIMELINE.quote, TIMELINE.textFadeDuration)
  ctx.save()
  ctx.globalAlpha = quoteAnim.alpha
  ctx.translate(0, quoteAnim.dy)
  ctx.font = 'italic 600 20px system-ui, sans-serif'
  ctx.fillText(`"${character.line}"`, WIDTH / 2, taglineEndY + 44)
  ctx.restore()

  const countP = easeOutCubic(clamp01((t - TIMELINE.countStart) / TIMELINE.countDuration))
  const shownCount = Math.round(matchCount * countP)
  const countPunch = countP >= 1 ? 1 + Math.max(0, 1 - (t - TIMELINE.countStart - TIMELINE.countDuration) / 0.25) * 0.1 : 1
  ctx.save()
  ctx.globalAlpha = clamp01((t - TIMELINE.countStart) / TIMELINE.countFadeDuration)
  ctx.translate(WIDTH / 2, taglineEndY + 110)
  ctx.scale(countPunch, countPunch)
  ctx.font = '700 30px system-ui, sans-serif'
  ctx.fillText(`지구에 단 ${shownCount.toLocaleString()}명`, 0, 0)
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = clamp01((t - TIMELINE.countStart) / TIMELINE.countFadeDuration)
  ctx.font = '400 18px system-ui, sans-serif'
  ctx.fillText('당신과 꼭 맞는 사람입니다', WIDTH / 2, taglineEndY + 142)
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = clamp01((t - TIMELINE.hashtag) / 0.5)
  ctx.font = '400 15px system-ui, sans-serif'
  ctx.fillText('#80억분의1 #연애시뮬레이션', WIDTH / 2, HEIGHT - 40)
  ctx.restore()
}

function drawSparkles(ctx: CanvasRenderingContext2D, t: number) {
  const count = 8
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + t * 0.3
    const radiusWobble = PORTRAIT_RADIUS + 30 + Math.sin(t * 1.5 + i) * 14
    const x = PORTRAIT_CENTER.x + Math.cos(angle) * radiusWobble
    const y = PORTRAIT_CENTER.y + Math.sin(angle) * radiusWobble * 0.9
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
    const x = PORTRAIT_CENTER.x + Math.cos(angle) * (PORTRAIT_RADIUS + 14 + dist)
    const y = PORTRAIT_CENTER.y + Math.sin(angle) * (PORTRAIT_RADIUS + 14 + dist) * 0.9
    const size = 2 + (1 - progress) * 3.5
    const useTint = i % 3 === 0

    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = useTint ? hexToRgba(tintHex, fade * 0.85) : `rgba(255,255,255,${fade * 0.85})`
    ctx.fill()
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
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
