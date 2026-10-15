import type { GameResult } from '../types'
import { buildShareUrl } from '../game/share'
import { CharacterPortrait } from './CharacterPortrait'
import { ShareCard } from './ShareCard'
import { ResultVideo } from './ResultVideo'
import { GoodsPreview } from './GoodsPreview'

interface ResultScreenProps {
  result: GameResult
  onRestart: () => void
  isShared?: boolean
}

export function ResultScreen({ result, onRestart, isShared = false }: ResultScreenProps) {
  const { character, tier, matchCount, traitLabel, vibeLabel } = result
  const shareUrl = buildShareUrl(result)

  return (
    <div className="screen result-screen">
      <p className="eyebrow">{isShared ? '공유된 결과' : '결과 발표'}</p>
      <h2>{isShared ? '친구의 80억분의 1은...' : '당신의 80억분의 1은...'}</h2>

      <div
        className="result-hero"
        style={{
          background: `linear-gradient(135deg, ${character.gradient[0]}, ${character.gradient[1]})`,
        }}
      >
        <span className="tier-badge">{tier}</span>
        <CharacterPortrait vibe={character.vibe} trait={character.trait} size={140} ringColor="rgba(255,255,255,0.7)" />
        <h1>{character.name}</h1>
        <p className="result-sub">{vibeLabel} 분위기 · {traitLabel} 성격</p>
        <p className="result-tagline">{character.tagline}</p>
        <p className="result-line">“{character.line}”</p>
      </div>

      <p className="match-count">
        지구에 {isShared ? '친구와' : '당신과'} 꼭 맞는 사람은 약 <strong>{matchCount.toLocaleString()}명</strong>
      </p>

      <ShareCard result={result} shareUrl={shareUrl} />

      <ResultVideo result={result} />

      <GoodsPreview result={result} />

      <button className="secondary-button" onClick={onRestart}>
        {isShared ? '나도 내 이상형 찾아보기' : '다시 테스트하기'}
      </button>

      <p className="future-note">
        * 더 실사에 가까운 AI 영상 생성과 굿즈 실제 주문·결제는 추후 업데이트될 예정입니다.
      </p>
    </div>
  )
}
