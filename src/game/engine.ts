import type { CategoryAmounts, CategoryResult, FinanceCategory, GameResult, Tier } from '../types'

const CATEGORIES: FinanceCategory[] = ['income', 'spending', 'realEstate', 'stocks', 'insurance']

export const initialCategoryAmounts: CategoryAmounts = {
  income: 0,
  spending: 0,
  realEstate: 0,
  stocks: 0,
  insurance: 0,
}

// Rough, illustrative reference points for entertainment purposes only — not
// official statistics. `median` is the amount mapped to the 50th percentile;
// `steepness` controls how fast the percentile moves per doubling of the
// amount-to-median ratio; `invert` means a smaller amount ranks better.
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

export function computeResult(amounts: CategoryAmounts): GameResult {
  const categories: CategoryResult[] = CATEGORIES.map((category) => ({
    category,
    amount: amounts[category],
    percentile: amountToPercentile(amounts[category], BENCHMARKS[category]),
  }))

  const overallPercentile =
    Math.round((categories.reduce((sum, c) => sum + c.percentile, 0) / categories.length) * 10) / 10

  const tier = percentileToTier(overallPercentile)

  const sorted = [...categories].sort((a, b) => a.percentile - b.percentile)
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]

  return { tier, overallPercentile, categories, strongest, weakest }
}
