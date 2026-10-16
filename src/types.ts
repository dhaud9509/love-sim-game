export type FinanceCategory = 'income' | 'spending' | 'realEstate' | 'stocks' | 'insurance'

export type Tier = '흙수저' | '은수저' | '금수저' | '다이아몬드수저'

export interface CategoryInputConfig {
  category: FinanceCategory
  title: string
  prompt: string
  unit: string
  placeholder: string
  helper: string
}

export type CategoryAmounts = Record<FinanceCategory, number>

export interface CategoryResult {
  category: FinanceCategory
  amount: number
  percentile: number
}

export interface TierProfile {
  tier: Tier
  tagline: string
  gradient: [string, string]
}

export interface GameResult {
  tier: Tier
  overallPercentile: number
  categories: CategoryResult[]
  strongest: CategoryResult
  weakest: CategoryResult
}

export type Screen = 'intro' | 'input' | 'result'
