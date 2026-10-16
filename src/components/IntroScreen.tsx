interface IntroScreenProps {
  onStart: () => void
  hasSavedProgress: boolean
  onContinue: () => void
}

export function IntroScreen({ onStart, hasSavedProgress, onContinue }: IntroScreenProps) {
  return (
    <div className="screen intro-screen">
      <p className="eyebrow">WEALTH PERCENTILE TEST</p>
      <h1 className="counter-number">상위 몇 %?</h1>
      <h2>재력 백분위 테스트</h2>
      <p className="description">
        수입·지출·부동산·주식·보험, 5개 항목에 실제 금액을 입력하면
        항목별 레이더 차트와 함께 당신의 재력 등급(수저계급)과 전체
        백분위가 나옵니다.
      </p>
      <button className="primary-button" onClick={onStart}>
        {hasSavedProgress ? '새로 시작하기' : '테스트 시작하기'}
      </button>
      {hasSavedProgress && (
        <button className="secondary-button" onClick={onContinue}>
          이어서 하기
        </button>
      )}
    </div>
  )
}
