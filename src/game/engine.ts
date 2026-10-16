import type { CategoryAmounts, CategoryResult, FinanceCategory, GameResult, Tier } from '../types'
import { computeWorldRank } from './worldRank'

const CATEGORIES: FinanceCategory[] = ['income', 'spending', 'realEstate', 'stocks', 'insurance']

export const initialCategoryAmounts: CategoryAmounts = {
  income: 0,
  spending: 0,
  realEstate: 0,
  stocks: 0,
  insurance: 0,
}

// Rough, illustrative reference points for the per-category "상세 분석"
// radar chart — entertainment purposes only, not official statistics.
// The headline tier/rank uses the real-data worldRank calculation instead
// (see worldRank.ts); this curve only shapes the category breakdown.
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

export function computeResult(amounts: CategoryAmounts, krwPerUsd: number, rateIsLive: boolean): GameResult {
  const categories: CategoryResult[] = CATEGORIES.map((category) => ({
    category,
    amount: amounts[category],
    percentile: amountToPercentile(amounts[category], BENCHMARKS[category]),
  }))

  const sorted = [...categories].sort((a, b) => a.percentile - b.percentile)
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]

  // Net worth for the real-world ranking = property + investment assets.
  // Income/spending/insurance are cash-flow figures, not a stock of wealth.
  const assetsManwon = amounts.realEstate + amounts.stocks
  const worldRank = computeWorldRank(assetsManwon, krwPerUsd, rateIsLive)
  const tier = percentileToTier(worldRank.percentile)

  return {
    tier,
    overallPercentile: worldRank.percentile,
    categories,
    strongest,
    weakest,
    worldRank,
    assetsManwon,
  }
}
