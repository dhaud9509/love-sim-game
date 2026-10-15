interface IntroScreenProps {
  onStart: () => void
  hasSavedProgress: boolean
  onContinue: () => void
}

export function IntroScreen({ onStart, hasSavedProgress, onContinue }: IntroScreenProps) {
  return (
    <div className="screen intro-screen">
      <p className="eyebrow">LOVE SIMULATION</p>
      <h1 className="counter-number">8,000,000,000</h1>
      <h2>80억 명 중, 당신의 사람은 단 한 명</h2>
      <p className="description">
        몇 가지 선택만으로 당신의 이상형이 어떤 성격과 분위기를 가진 사람인지
        찾아드립니다. 선택을 거듭할수록 후보는 줄어들고, 마지막엔 단 한 사람이
        남습니다.
      </p>
      <button className="primary-button" onClick={onStart}>
        {hasSavedProgress ? '새로 시작하기' : '시작하기'}
      </button>
      {hasSavedProgress && (
        <button className="secondary-button" onClick={onContinue}>
          이어서 하기
        </button>
      )}
    </div>
  )
}
