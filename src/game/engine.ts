import { characterPool, traitLabels, vibeLabels } from '../data/characters'
import type {
  AppearanceVibe,
  GameResult,
  PersonalityScores,
  PersonalityTrait,
  RarityTier,
  VibeScores,
} from '../types'

export const initialPersonalityScores: PersonalityScores = {
  warm: 0,
  cool: 0,
  humor: 0,
  serious: 0,
}

export const initialVibeScores: VibeScores = {
  cute: 0,
  chic: 0,
  elegant: 0,
  bright: 0,
}

const tierRanges: Record<RarityTier, [number, number]> = {
  일반: [3000, 30000],
  레어: [300, 3000],
  에픽: [30, 300],
  레전더리: [1, 30],
}

function topKeyAndMargin<T extends string>(scores: Record<T, number>): {
  key: T
  margin: number
} {
  const entries = Object.entries(scores) as [T, number][]
  entries.sort((a, b) => b[1] - a[1])
  const [topKey, topValue] = entries[0]
  const secondValue = entries[1]?.[1] ?? 0
  const total = entries.reduce((sum, [, value]) => sum + value, 0) || 1
  const margin = Math.min(1, Math.max(0, (topValue - secondValue) / total))
  return { key: topKey, margin }
}

export function computeResult(
  personalityScores: PersonalityScores,
  vibeScores: VibeScores,
): GameResult {
  const { key: trait, margin: traitMargin } = topKeyAndMargin<PersonalityTrait>(personalityScores)
  const { key: vibe, margin: vibeMargin } = topKeyAndMargin<AppearanceVibe>(vibeScores)

  const character = characterPool[`${trait}-${vibe}`]
  const combinedMargin = (traitMargin + vibeMargin) / 2

  const [min, max] = tierRanges[character.tier]
  const matchCount = Math.round(max - (max - min) * combinedMargin)

  return {
    character,
    tier: character.tier,
    matchCount,
    traitLabel: traitLabels[trait],
    vibeLabel: vibeLabels[vibe],
  }
}
