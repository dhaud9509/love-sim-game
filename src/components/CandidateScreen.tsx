import type { Candidate } from '../types'
import { CharacterPortrait } from './CharacterPortrait'

interface CandidateScreenProps {
  candidate: Candidate
  onDecide: (liked: boolean) => void
}

export function CandidateScreen({ candidate, onDecide }: CandidateScreenProps) {
  return (
    <div className="screen candidate-screen">
      <p className="eyebrow">누군가 지나간다</p>
      <CharacterPortrait vibe={candidate.vibe} size={110} />
      <p className="scene-text">{candidate.blurb}</p>
      <div className="choice-list candidate-choices">
        <button className="choice-button like" onClick={() => onDecide(true)}>
          💗 호감이 간다
        </button>
        <button className="choice-button pass" onClick={() => onDecide(false)}>
          그냥 지나친다
        </button>
      </div>
    </div>
  )
}
