import { questions } from '../data/questions'
import type { CategoryResult, CategoryScores, FinanceCategory, GameResult, Tier } from '../types'

const CATEGORIES: FinanceCategory[] = ['income', 'spending', 'realEstate', 'stocks', 'insurance']

export const initialCategoryScores: CategoryScores = {
  income: 0,
  spending: 0,
  realEstate: 0,
  stocks: 0,
  insurance: 0,
}

const categoryMax: CategoryScores = CATEGORIES.reduce((acc, category) => {
  acc[category] = questions
    .filter((q) => q.category === category)
    .reduce((sum, q) => sum + Math.max(...q.choices.map((c) => c.score)), 0)
  return acc
}, {} as CategoryScores)

const PERCENTILE_MIN = 0.5
const PERCENTILE_MAX = 92

function scoreToPercentile(score: number, max: number): number {
  const fraction = max > 0 ? score / max : 0
  const percentile = PERCENTILE_MIN + (1 - fraction) * (PERCENTILE_MAX - PERCENTILE_MIN)
  return Math.round(percentile * 10) / 10
}

function percentileToTier(percentile: number): Tier {
  if (percentile < 2) return '다이아몬드수저'
  if (percentile < 15) return '금수저'
  if (percentile < 40) return '은수저'
  return '흙수저'
}

export function computeResult(scores: CategoryScores): GameResult {
  const categories: CategoryResult[] = CATEGORIES.map((category) => ({
    category,
    score: scores[category],
    percentile: scoreToPercentile(scores[category], categoryMax[category]),
  }))

  const overallPercentile =
    Math.round((categories.reduce((sum, c) => sum + c.percentile, 0) / categories.length) * 10) / 10

  const tier = percentileToTier(overallPercentile)

  const sorted = [...categories].sort((a, b) => a.percentile - b.percentile)
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]

  return { tier, overallPercentile, categories, strongest, weakest }
}
