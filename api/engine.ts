// Mirrors the percentile/tier formula in src/game/engine.ts so the OG image
// can be computed from the same `?inc=&sp=&re=&st=&ins=` share params without
// importing across the api/ boundary (see the note in api/tiers.ts).
// CATEGORY_MAX mirrors the sum of each category's max choice score in
// src/data/questions.ts — keep in sync if those questions change.

import type { FinanceCategory } from './tiers.js'
import type { Tier } from './badge.js'

const CATEGORY_MAX: Record<FinanceCategory, number> = {
  income: 40,
  spending: 40,
  realEstate: 40,
  stocks: 39,
  insurance: 40,
}

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

export function computeOgResult(scores: Partial<Record<FinanceCategory, number>>): OgResult {
  const categories = (Object.keys(CATEGORY_MAX) as FinanceCategory[]).map((category) => ({
    category,
    percentile: scoreToPercentile(scores[category] ?? 0, CATEGORY_MAX[category]),
  }))

  const overallPercentile =
    Math.round((categories.reduce((sum, c) => sum + c.percentile, 0) / categories.length) * 10) / 10
  const tier = percentileToTier(overallPercentile)
  const sorted = [...categories].sort((a, b) => a.percentile - b.percentile)

  return { tier, overallPercentile, strongest: sorted[0], weakest: sorted[sorted.length - 1] }
}
