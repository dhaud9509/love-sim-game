import type { GameResult, Tier } from '../types'
import { buildShareUrl } from '../game/share'
import { usdForPercentile } from '../game/worldRank'
import { tierProfiles, categoryLabels } from '../data/tiers'
import { formatManwon, formatCount } from '../format'
import { TierBadge } from './TierBadge'
import { RadarChart } from './RadarChart'
import { ShareCard } from './ShareCard'

interface ResultScreenProps {
  result: GameResult
  onRestart: () => void
  isShared?: boolean
}

const NEXT_TIER_PERCENTILE: Partial<Record<Tier, number>> = { 흙수저: 40, 은수저: 15, 금수저: 2 }
const NEXT_TIER_NAME: Partial<Record<Tier, Tier>> = { 흙수저: '은수저', 은수저: '금수저', 금수저: '다이아몬드수저' }

function nextTierGap(result: GameResult): string {
  const nextPercentile = NEXT_TIER_PERCENTILE[result.tier]
  if (nextPercentile === undefined) return '이미 세계 최상위권이에요 👑'

  const neededUsd = usdForPercentile(nextPercentile)
  const neededManwon = (neededUsd * result.worldRank.krwPerUsd) / 10000
  const gap = Math.max(0, neededManwon - result.assetsManwon)
  return `${NEXT_TIER_NAME[result.tier]}까지 약 ${formatManwon(gap)} 더 필요해요`
}

export function ResultScreen({ result, onRestart, isShared = false }: ResultScreenProps) {
  const { tier, categories, strongest, weakest, worldRank, assetsManwon } = result
  const profile = tierProfiles[tier]
  const shareUrl = buildShareUrl(result)

  return (
    <div className="screen result-screen">
      <p className="eyebrow">{isShared ? '공유된 결과' : '결과 발표'}</p>
      <h2>{isShared ? '친구의 세계 재산 순위는...' : '당신의 세계 재산 순위는...'}</h2>

      <div
        className="result-hero"
        style={{
          background: `linear-gradient(135deg, ${profile.gradient[0]}, ${profile.gradient[1]})`,
        }}
      >
        <span className="tier-badge">{tier}</span>
        <TierBadge tier={tier} size={140} ringColor="rgba(255,255,255,0.7)" />
        <p className="world-rank-label">전 세계 80억 명 중</p>
        <h1>약 {formatCount(worldRank.rank)}등</h1>
        <p className="world-rank-percentile">상위 {worldRank.percentile}%</p>
        <p className="result-sub">{profile.tagline}</p>
        <p className="result-tagline">
          부동산·주식 자산 {formatManwon(assetsManwon)} 기준 · {nextTierGap(result)}
        </p>
        <p className="rate-note">
          1 USD = {Math.round(worldRank.krwPerUsd).toLocaleString()}원 {worldRank.rateIsLive ? '(실시간 환율)' : '(기준 환율)'}
        </p>
      </div>

      <p className="section-label">항목별 상세 분석</p>
      <RadarChart categories={categories} color={profile.gradient[0]} />

      <ul className="category-list">
        {categories.map((c) => (
          <li key={c.category}>
            <span>
              {categoryLabels[c.category]}
              <em>{formatManwon(c.amount)}</em>
            </span>
            <strong>상위 {c.percentile}%</strong>
          </li>
        ))}
      </ul>
      <p className="category-callout">
        강점: {categoryLabels[strongest.category]} · 약점: {categoryLabels[weakest.category]}
      </p>

      <ShareCard result={result} shareUrl={shareUrl} />

      <button className="secondary-button" onClick={onRestart}>
        {isShared ? '나도 테스트해보기' : '다시 테스트하기'}
      </button>

      <p className="future-note">
        * 세계 재산 순위는 UBS Global Wealth Report 2025 기준 자산 분포와 실시간 환율을 이용한 추정치이며, 항목별 상세 분석은
        재미로 보는 참고용 지표입니다. 실제 재무 상담이나 자산 평가가 아닙니다.
      </p>
    </div>
  )
}
