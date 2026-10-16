interface IntroScreenProps {
  onStart: () => void
  hasSavedProgress: boolean
  onContinue: () => void
}

export function IntroScreen({ onStart, hasSavedProgress, onContinue }: IntroScreenProps) {
  return (
    <div className="screen intro-screen">
      <p className="eyebrow">WEALTH PERCENTILE TEST</p>
      <h1 className="counter-number">80억분의 몇 등?</h1>
      <h2>재력 백분위 테스트</h2>
      <p className="description">
        부동산·주식 자산을 입력하면 실시간 환율로 전 세계 80억 명 중 내
        재산 순위를 계산해드려요. 수입·지출·보험까지 5개 항목 레이더
        차트로 상세 분석과 재력 등급(수저계급)까지 확인하세요.
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
