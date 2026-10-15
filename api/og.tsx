import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { characterPool, traitLabels, vibeLabels } from './characters.js'
import type { CharacterProfile } from './characters.js'
import { portraitDataUrl } from './portrait.js'

export const config = { runtime: 'nodejs' }

const WIDTH = 1200
const HEIGHT = 630
const FONT_URL = 'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/Pretendard-Bold.otf'

let fontCache: ArrayBuffer | null = null

async function loadFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache
  const res = await fetch(FONT_URL)
  fontCache = await res.arrayBuffer()
  return fontCache
}

async function renderPng(element: Parameters<typeof satori>[0]): Promise<Buffer> {
  const font = await loadFont()
  const svg = await satori(element, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [{ name: 'Pretendard', data: font, weight: 700, style: 'normal' }],
  })
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } })
  return resvg.render().asPng()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url, 'http://localhost')
  const key = searchParams.get('r')
  const character = key ? characterPool[key] : undefined

  const rawCount = Number(searchParams.get('m'))
  const matchCount = Number.isFinite(rawCount) && rawCount > 0 ? Math.round(rawCount) : null

  const png = character ? await renderPng(characterCard(character, matchCount)) : await renderPng(genericCard())

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
    },
  })
}

function genericCard() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 18% 15%, #3a1f4d 0%, #1a1225 55%, #0d0813 100%)',
        fontFamily: 'Pretendard',
      }}
    >
      <div style={{ display: 'flex', fontSize: 22, letterSpacing: 6, color: '#ff4f9a', fontWeight: 700, marginBottom: 14 }}>
        LOVE SIMULATION
      </div>
      <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, color: '#fff' }}>80억분의 1</div>
      <div style={{ display: 'flex', fontSize: 28, color: 'rgba(255,255,255,0.72)', marginTop: 20 }}>
        선택을 거듭할수록, 당신의 이상형이 좁혀집니다
      </div>
    </div>
  )
}

function characterCard(character: CharacterProfile, matchCount: number | null) {
  const portraitSrc = portraitDataUrl({ vibe: character.vibe, trait: character.trait })

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${character.gradient[0]}, ${character.gradient[1]})`,
        fontFamily: 'Pretendard',
      }}
    >
      <div style={{ display: 'flex', fontSize: 20, letterSpacing: 4, color: 'rgba(255,255,255,0.88)', fontWeight: 700, marginBottom: 20 }}>
        80억분의 1 · 연애 시뮬레이션
      </div>
      <div
        style={{
          display: 'flex',
          width: 190,
          height: 190,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '6px solid rgba(255,255,255,0.85)',
          marginBottom: 24,
        }}
      >
        <img src={portraitSrc} width={190} height={190} />
      </div>
      <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{character.name}</div>
      <div style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.88)', marginBottom: matchCount ? 18 : 0 }}>
        {vibeLabels[character.vibe]} 분위기 · {traitLabels[character.trait]} 성격
      </div>
      {matchCount && (
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#fff' }}>
          지구에 단 {matchCount.toLocaleString()}명
        </div>
      )}
    </div>
  )
}
