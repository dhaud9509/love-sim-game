// Self-contained mirror of src/game/worldRank.ts for the /api/og serverless
// function — see the note in api/tiers.ts for why this isn't imported from
// ../src. Keep the anchors and fallback rate in sync.

export const WORLD_POPULATION = 8_000_000_000
const FALLBACK_KRW_PER_USD = 1342

interface Anchor {
  usd: number
  percentile: number
}

const ANCHORS: Anchor[] = [
  { usd: 9_000, percentile: 50 },
  { usd: 175_000, percentile: 10 },
  { usd: 1_100_000, percentile: 1 },
]

const MIN_PERCENTILE = 0.01
const MAX_PERCENTILE = 99

function logLogSlope(a: Anchor, b: Anchor): number {
  return (Math.log10(b.percentile) - Math.log10(a.percentile)) / (Math.log10(b.usd) - Math.log10(a.usd))
}

function clamp(percentile: number): number {
  return Math.min(MAX_PERCENTILE, Math.max(MIN_PERCENTILE, percentile))
}

export function percentileFromUsd(usd: number): number {
  const safeUsd = Math.max(usd, 1)
  const logUsd = Math.log10(safeUsd)

  if (safeUsd <= ANCHORS[0].usd) {
    const slope = logLogSlope(ANCHORS[1], ANCHORS[0])
    const logP = Math.log10(ANCHORS[0].percentile) + slope * (logUsd - Math.log10(ANCHORS[0].usd))
    return clamp(Math.pow(10, logP))
  }

  for (let i = 0; i < ANCHORS.length - 1; i++) {
    const a = ANCHORS[i]
    const b = ANCHORS[i + 1]
    if (safeUsd >= a.usd && safeUsd <= b.usd) {
      const slope = logLogSlope(a, b)
      const logP = Math.log10(a.percentile) + slope * (logUsd - Math.log10(a.usd))
      return clamp(Math.pow(10, logP))
    }
  }

  const last = ANCHORS[ANCHORS.length - 1]
  const prev = ANCHORS[ANCHORS.length - 2]
  const slope = logLogSlope(prev, last)
  const logP = Math.log10(last.percentile) + slope * (logUsd - Math.log10(last.usd))
  return clamp(Math.pow(10, logP))
}

export interface WorldRank {
  usd: number
  percentile: number
  rank: number
}

export function computeWorldRank(assetsManwon: number, krwPerUsd: number): WorldRank {
  const usd = (Math.max(assetsManwon, 0) * 10_000) / krwPerUsd
  const percentile = Math.round(percentileFromUsd(usd) * 100) / 100
  const rank = Math.max(1, Math.round((percentile / 100) * WORLD_POPULATION))
  return { usd, percentile, rank }
}

export async function fetchKrwPerUsd(): Promise<number> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD')
    if (!res.ok) throw new Error('rate fetch failed')
    const data = (await res.json()) as { rates?: Record<string, number> }
    const rate = data?.rates?.KRW
    if (typeof rate === 'number' && rate > 0) return rate
    throw new Error('invalid rate payload')
  } catch {
    return FALLBACK_KRW_PER_USD
  }
}
