import { computeResult } from './engine'
import type { CategoryScores, FinanceCategory, GameResult } from '../types'

export const CATEGORY_PARAMS: Record<FinanceCategory, string> = {
  income: 'inc',
  spending: 'sp',
  realEstate: 're',
  stocks: 'st',
  insurance: 'ins',
}

function resultToScores(result: GameResult): CategoryScores {
  const scores = {} as CategoryScores
  for (const c of result.categories) scores[c.category] = c.score
  return scores
}

export function buildShareUrl(result: GameResult): string {
  const url = new URL(window.location.href)
  url.search = ''
  const scores = resultToScores(result)
  for (const [category, param] of Object.entries(CATEGORY_PARAMS) as [FinanceCategory, string][]) {
    url.searchParams.set(param, String(scores[category]))
  }
  return url.toString()
}

export function parseSharedResult(): GameResult | null {
  const params = new URLSearchParams(window.location.search)
  const entries = Object.entries(CATEGORY_PARAMS) as [FinanceCategory, string][]
  if (!entries.some(([, param]) => params.has(param))) return null

  const scores = {} as CategoryScores
  for (const [category, param] of entries) {
    const raw = Number(params.get(param))
    scores[category] = Number.isFinite(raw) && raw >= 0 ? raw : 0
  }
  return computeResult(scores)
}

export function clearShareParams() {
  const url = new URL(window.location.href)
  url.search = ''
  window.history.replaceState(null, '', url.toString())
}

export function syncShareUrl(result: GameResult) {
  window.history.replaceState(null, '', buildShareUrl(result))
}
