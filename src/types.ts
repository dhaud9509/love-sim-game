export type PersonalityTrait = 'warm' | 'cool' | 'humor' | 'serious'
export type AppearanceVibe = 'cute' | 'chic' | 'elegant' | 'bright'

export type PersonalityScores = Record<PersonalityTrait, number>
export type VibeScores = Record<AppearanceVibe, number>

export type RarityTier = '일반' | '레어' | '에픽' | '레전더리'

export interface QuestionChoice {
  text: string
  trait: PersonalityTrait
  weight: number
}

export interface Question {
  id: string
  scene: string
  prompt: string
  choices: QuestionChoice[]
}

export interface Candidate {
  id: string
  name: string
  vibe: AppearanceVibe
  blurb: string
  weight: number
}

export interface CharacterProfile {
  key: string
  trait: PersonalityTrait
  vibe: AppearanceVibe
  name: string
  tagline: string
  line: string
  gradient: [string, string]
  tier: RarityTier
}

export interface GameResult {
  character: CharacterProfile
  tier: RarityTier
  matchCount: number
  traitLabel: string
  vibeLabel: string
}

export type Screen = 'intro' | 'question' | 'candidate' | 'result'
