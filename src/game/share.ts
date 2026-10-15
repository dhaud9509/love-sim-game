import { characterPool, traitLabels, vibeLabels } from '../data/characters'
import type { GameResult } from '../types'

const DEFAULT_MATCH_COUNT = 1000

export function buildShareUrl(result: GameResult): string {
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('r', result.character.key)
  url.searchParams.set('m', String(result.matchCount))
  return url.toString()
}

export function parseSharedResult(): GameResult | null {
  const params = new URLSearchParams(window.location.search)
  const key = params.get('r')
  if (!key) return null

  const character = characterPool[key]
  if (!character) return null

  const rawCount = Number(params.get('m'))
  const matchCount = Number.isFinite(rawCount) && rawCount > 0 ? Math.round(rawCount) : DEFAULT_MATCH_COUNT

  return {
    character,
    tier: character.tier,
    matchCount,
    traitLabel: traitLabels[character.trait],
    vibeLabel: vibeLabels[character.vibe],
  }
}

export function clearShareParams() {
  const url = new URL(window.location.href)
  url.search = ''
  window.history.replaceState(null, '', url.toString())
}

export function syncShareUrl(result: GameResult) {
  window.history.replaceState(null, '', buildShareUrl(result))
}
