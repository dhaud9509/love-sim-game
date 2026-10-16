import type { GameResult } from '../types'
import { buildShareUrl } from '../game/share'
import { tierProfiles, categoryLabels } from '../data/tiers'
import { TierBadge } from './TierBadge'
import { RadarChart } from './RadarChart'
import { ShareCard } from './ShareCard'
import { ResultVideo } from './ResultVideo'
import { GoodsPreview } from './GoodsPreview'

interface ResultScreenProps {
  result: GameResult
  onRestart: () => void
  isShared?: boolean
}

export function ResultScreen({ result, onRestart, isShared = false }: ResultScreenProps) {
  const { tier, overallPercentile, categories, strongest, weakest } = result
  const profile = tierProfiles[tier]
  const shareUrl = buildShareUrl(result)

  return (
    <div className="screen result-screen">
      <p className="eyebrow">{isShared ? '공유된 결과' : '결과 발표'}</p>
      <h2>{isShared ? '친구의 재력 백분위는...' : '당신의 재력 백분위는...'}</h2>

      <div
        className="result-hero"
        style={{
          background: `linear-gradient(135deg, ${profile.gradient[0]}, ${profile.gradient[1]})`,
        }}
      >
        <span className="tier-badge">{tier}</span>
        <TierBadge tier={tier} size={140} ringColor="rgba(255,255,255,0.7)" />
        <h1>상위 {overallPercentile}%</h1>
        <p className="result-sub">{profile.tagline}</p>
        <p className="result-tagline">
          강점: {categoryLabels[strongest.category]} · 약점: {categoryLabels[weakest.category]}
        </p>
      </div>

      <RadarChart categories={categories} color={profile.gradient[0]} />

      <ul className="category-list">
        {categories.map((c) => (
          <li key={c.category}>
            <span>{categoryLabels[c.category]}</span>
            <strong>상위 {c.percentile}%</strong>
          </li>
        ))}
      </ul>

      <ShareCard result={result} shareUrl={shareUrl} />

      <ResultVideo result={result} />

      <GoodsPreview result={result} />

      <button className="secondary-button" onClick={onRestart}>
        {isShared ? '나도 테스트해보기' : '다시 테스트하기'}
      </button>

      <p className="future-note">* 재미로 보는 테스트이며 실제 재무 상담이나 자산 평가가 아닙니다.</p>
    </div>
  )
}
