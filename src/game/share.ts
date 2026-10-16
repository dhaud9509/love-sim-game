import { computeResult } from './engine'
import { fetchKrwPerUsd } from './worldRank'
import type { CategoryAmounts, FinanceCategory, GameResult } from '../types'

export const CATEGORY_PARAMS: Record<FinanceCategory, string> = {
  income: 'inc',
  spending: 'sp',
  realEstate: 're',
  stocks: 'st',
  insurance: 'ins',
}

function resultToAmounts(result: GameResult): CategoryAmounts {
  const amounts = {} as CategoryAmounts
  for (const c of result.categories) amounts[c.category] = c.amount
  return amounts
}

export function buildShareUrl(result: GameResult): string {
  const url = new URL(window.location.href)
  url.search = ''
  const amounts = resultToAmounts(result)
  for (const [category, param] of Object.entries(CATEGORY_PARAMS) as [FinanceCategory, string][]) {
    url.searchParams.set(param, String(amounts[category]))
  }
  return url.toString()
}

export function hasSharedAmounts(): boolean {
  const params = new URLSearchParams(window.location.search)
  return (Object.values(CATEGORY_PARAMS) as string[]).some((param) => params.has(param))
}

export async function parseSharedResult(): Promise<GameResult | null> {
  if (!hasSharedAmounts()) return null

  const params = new URLSearchParams(window.location.search)
  const amounts = {} as CategoryAmounts
  for (const [category, param] of Object.entries(CATEGORY_PARAMS) as [FinanceCategory, string][]) {
    const raw = Number(params.get(param))
    amounts[category] = Number.isFinite(raw) && raw >= 0 ? raw : 0
  }

  const { rate, isLive } = await fetchKrwPerUsd()
  return computeResult(amounts, rate, isLive)
}

export function clearShareParams() {
  const url = new URL(window.location.href)
  url.search = ''
  window.history.replaceState(null, '', url.toString())
}

export function syncShareUrl(result: GameResult) {
  window.history.replaceState(null, '', buildShareUrl(result))
}
