// Mirrors the amount-to-percentile formula in src/game/engine.ts so the OG
// image can be computed from the same `?inc=&sp=&re=&st=&ins=` share params
// (now raw 만원 amounts) without importing across the api/ boundary — see the
// note in api/tiers.ts. Keep BENCHMARKS in sync with src/game/engine.ts.

import type { FinanceCategory } from './tiers.js'
import type { Tier } from './badge.js'

interface Benchmark {
  median: number
  steepness: number
  invert?: boolean
}

const BENCHMARKS: Record<FinanceCategory, Benchmark> = {
  income: { median: 300, steepness: 1.1 },
  spending: { median: 200, steepness: 1.0, invert: true },
  realEstate: { median: 10000, steepness: 0.9 },
  stocks: { median: 500, steepness: 0.9 },
  insurance: { median: 15, steepness: 0.8 },
}

const PERCENTILE_MIN = 0.1
const PERCENTILE_MAX = 95

function amountToPercentile(amount: number, benchmark: Benchmark): number {
  const safeAmount = Math.max(amount, 0)
  const ratio = benchmark.invert
    ? benchmark.median / Math.max(safeAmount, 1)
    : Math.max(safeAmount, 1) / benchmark.median

  const x = Math.log2(Math.max(ratio, 0.001))
  const percentile = 100 / (1 + Math.pow(2, x * benchmark.steepness))
  return Math.round(Math.min(PERCENTILE_MAX, Math.max(PERCENTILE_MIN, percentile)) * 10) / 10
}

function percentileToTier(percentile: number): Tier {
  if (percentile < 2) return '다이아몬드수저'
  if (percentile < 15) return '금수저'
  if (percentile < 40) return '은수저'
  return '흙수저'
}

export interface OgCategoryResult {
  category: FinanceCategory
  percentile: number
}

export interface OgResult {
  tier: Tier
  overallPercentile: number
  strongest: OgCategoryResult
  weakest: OgCategoryResult
}

export function computeOgResult(amounts: Partial<Record<FinanceCategory, number>>): OgResult {
  const categories = (Object.keys(BENCHMARKS) as FinanceCategory[]).map((category) => ({
    category,
    percentile: amountToPercentile(amounts[category] ?? 0, BENCHMARKS[category]),
  }))

  const overallPercentile =
    Math.round((categories.reduce((sum, c) => sum + c.percentile, 0) / categories.length) * 10) / 10
  const tier = percentileToTier(overallPercentile)
  const sorted = [...categories].sort((a, b) => a.percentile - b.percentile)

  return { tier, overallPercentile, strongest: sorted[0], weakest: sorted[sorted.length - 1] }
}
