// Self-contained copy of src/data/tiers.ts for the /api/og serverless
// function — Vercel's Node function bundler does not reliably trace relative
// imports that cross the api/ directory boundary, so this stays duplicated
// rather than imported from ../src. Keep in sync if tiers/categories change.

import type { Tier } from './badge.js'

export type FinanceCategory = 'income' | 'spending' | 'realEstate' | 'stocks' | 'insurance'

export interface TierProfile {
  tier: Tier
  tagline: string
  gradient: [string, string]
}

export const tierProfiles: Record<Tier, TierProfile> = {
  흙수저: {
    tier: '흙수저',
    tagline: '이제 막 시작하는 단계 — 지금부터가 진짜 중요하다',
    gradient: ['#8d6346', '#c89b6d'],
  },
  은수저: {
    tier: '은수저',
    tagline: '탄탄하게 자리 잡아가는 중, 다음 레벨이 머지않았다',
    gradient: ['#9aa3ad', '#e2e6ea'],
  },
  금수저: {
    tier: '금수저',
    tagline: '이미 꽤 잘 굴리고 있는 재테크 고수',
    gradient: ['#d4941f', '#f6d365'],
  },
  다이아몬드수저: {
    tier: '다이아몬드수저',
    tagline: '흔치 않은 재력 상위권, 이미 다른 세계에 있다',
    gradient: ['#5ec8e0', '#c2e9fb'],
  },
}

export const categoryLabels: Record<FinanceCategory, string> = {
  income: '수입',
  spending: '지출',
  realEstate: '부동산',
  stocks: '주식·투자',
  insurance: '보험',
}
