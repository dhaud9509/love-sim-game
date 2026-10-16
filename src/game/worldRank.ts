// Global net-worth percentile curve, anchored to real published figures from
// the UBS Global Wealth Report 2025: ~$9,000 median adult wealth, ~$175,000
// to reach the top 10%, ~$1.1M to reach the top 1%. We piecewise-interpolate
// (log-log, since wealth distributions are heavy-tailed) between these real
// anchor points rather than inventing a curve — the quiz is still "for fun,"
// but the shape is grounded in a real report, not a made-up one.
// Source: UBS Global Wealth Report 2025.

export const WORLD_POPULATION = 8_000_000_000
const FALLBACK_KRW_PER_USD = 1342

interface Anchor {
  usd: number
  percentile: number // rank from the top, e.g. 1 = top 1%
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

function clamp(percentile: number): number {
  return Math.min(MAX_PERCENTILE, Math.max(MIN_PERCENTILE, percentile))
}

export interface WorldRank {
  usd: number
  percentile: number
  rank: number
  krwPerUsd: number
  rateIsLive: boolean
}

export function computeWorldRank(assetsManwon: number, krwPerUsd: number, rateIsLive: boolean): WorldRank {
  const usd = (Math.max(assetsManwon, 0) * 10_000) / krwPerUsd
  const percentile = Math.round(percentileFromUsd(usd) * 100) / 100
  const rank = Math.max(1, Math.round((percentile / 100) * WORLD_POPULATION))
  return { usd, percentile, rank, krwPerUsd, rateIsLive }
}

// Fetches today's USD/KRW rate from a free, no-key, daily-updating API.
// Falls back to a fixed recent rate if the request fails (offline, blocked, etc).
export async function fetchKrwPerUsd(): Promise<{ rate: number; isLive: boolean }> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD')
    if (!res.ok) throw new Error('rate fetch failed')
    const data = await res.json()
    const rate = data?.rates?.KRW
    if (typeof rate === 'number' && rate > 0) return { rate, isLive: true }
    throw new Error('invalid rate payload')
  } catch {
    return { rate: FALLBACK_KRW_PER_USD, isLive: false }
  }
}

// USD threshold needed to reach a given global percentile — used to show
// "다음 등급까지 얼마나 더 필요한지" style gap messaging.
export function usdForPercentile(targetPercentile: number): number {
  // Binary search over the same curve since percentileFromUsd isn't trivially invertible piecewise.
  let lo = 1
  let hi = 1_000_000_000
  for (let i = 0; i < 60; i++) {
    const mid = Math.sqrt(lo * hi)
    const p = percentileFromUsd(mid)
    if (p > targetPercentile) {
      lo = mid
    } else {
      hi = mid
    }
  }
  return hi
}
