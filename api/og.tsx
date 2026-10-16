import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { computeOgResult } from './engine.js'
import { tierProfiles, categoryLabels } from './tiers.js'
import type { FinanceCategory, TierProfile } from './tiers.js'
import { badgeDataUrl } from './badge.js'

export const config = { runtime: 'nodejs' }

const WIDTH = 1200
const HEIGHT = 630
const FONT_URL = 'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/Pretendard-Bold.otf'

// Mirrors CATEGORY_PARAMS in src/game/share.ts
const CATEGORY_PARAMS: Record<FinanceCategory, string> = {
  income: 'inc',
  spending: 'sp',
  realEstate: 're',
  stocks: 'st',
  insurance: 'ins',
}

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

  const hasScores = (Object.values(CATEGORY_PARAMS) as string[]).some((param) => searchParams.has(param))

  let png: Buffer
  if (hasScores) {
    const scores = {} as Record<FinanceCategory, number>
    for (const [category, param] of Object.entries(CATEGORY_PARAMS) as [FinanceCategory, string][]) {
      const raw = Number(searchParams.get(param))
      scores[category] = Number.isFinite(raw) && raw >= 0 ? raw : 0
    }
    const result = computeOgResult(scores)
    png = await renderPng(resultCard(result))
  } else {
    png = await renderPng(genericCard())
  }

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
        WEALTH PERCENTILE TEST
      </div>
      <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, color: '#fff' }}>재력 백분위 테스트</div>
      <div style={{ display: 'flex', fontSize: 28, color: 'rgba(255,255,255,0.72)', marginTop: 20 }}>
        수입·지출·부동산·주식·보험, 5개 항목으로 보는 내 재력 상세 분석
      </div>
    </div>
  )
}

function resultCard(result: {
  tier: TierProfile['tier']
  overallPercentile: number
  strongest: { category: FinanceCategory }
  weakest: { category: FinanceCategory }
}) {
  const profile = tierProfiles[result.tier]
  const badgeSrc = badgeDataUrl(result.tier)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${profile.gradient[0]}, ${profile.gradient[1]})`,
        fontFamily: 'Pretendard',
      }}
    >
      <div style={{ display: 'flex', fontSize: 20, letterSpacing: 4, color: 'rgba(255,255,255,0.88)', fontWeight: 700, marginBottom: 20 }}>
        재력 백분위 테스트
      </div>
      <div
        style={{
          display: 'flex',
          width: 180,
          height: 180,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '6px solid rgba(255,255,255,0.85)',
          marginBottom: 20,
        }}
      >
        <img src={badgeSrc} width={180} height={180} />
      </div>
      <div style={{ display: 'flex', fontSize: 56, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
        상위 {result.overallPercentile}%
      </div>
      <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
        [ {result.tier} ]
      </div>
      <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.88)' }}>
        강점 {categoryLabels[result.strongest.category]} · 약점 {categoryLabels[result.weakest.category]}
      </div>
    </div>
  )
}
