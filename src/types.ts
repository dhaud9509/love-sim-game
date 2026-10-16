export type FinanceCategory = 'income' | 'spending' | 'realEstate' | 'stocks' | 'insurance'

export type Tier = '흙수저' | '은수저' | '금수저' | '다이아몬드수저'

export interface QuestionChoice {
  text: string
  score: number
}

export interface Question {
  id: string
  category: FinanceCategory
  scene: string
  prompt: string
  choices: QuestionChoice[]
}

export type CategoryScores = Record<FinanceCategory, number>

export interface CategoryResult {
  category: FinanceCategory
  score: number
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

export type Screen = 'intro' | 'question' | 'result'
