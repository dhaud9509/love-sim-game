import { useEffect, useMemo, useState } from 'react'
import { track } from '@vercel/analytics'
import './App.css'
import { IntroScreen } from './components/IntroScreen'
import { AmountScreen } from './components/AmountScreen'
import { ResultScreen } from './components/ResultScreen'
import { categoryInputs } from './data/categoryInputs'
import { computeResult, initialCategoryAmounts } from './game/engine'
import { clearShareParams, parseSharedResult, syncShareUrl } from './game/share'
import type { CategoryAmounts, GameResult, Screen } from './types'

const STORAGE_KEY = 'wealth-test-progress-v2'

interface SavedProgress {
  stepIndex: number
  amounts: CategoryAmounts
}

function loadSavedProgress(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SavedProgress
  } catch {
    return null
  }
}

function App() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [amounts, setAmounts] = useState<CategoryAmounts>(initialCategoryAmounts)
  const [result, setResult] = useState<GameResult | null>(null)
  const [hasSavedProgress, setHasSavedProgress] = useState(false)
  const [isSharedView, setIsSharedView] = useState(false)

  useEffect(() => {
    const shared = parseSharedResult()
    if (shared) {
      setResult(shared)
      setIsSharedView(true)
      setScreen('result')
      track('shared_view_opened', { tier: shared.tier })
      return
    }
    setHasSavedProgress(loadSavedProgress() !== null)
  }, [])

  const currentInput = useMemo(() => categoryInputs[stepIndex], [stepIndex])

  function persist(nextIndex: number, nextAmounts: CategoryAmounts) {
    const data: SavedProgress = { stepIndex: nextIndex, amounts: nextAmounts }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function goToStep(index: number, nextAmounts: CategoryAmounts) {
    if (index >= categoryInputs.length) {
      localStorage.removeItem(STORAGE_KEY)
      const finalResult = computeResult(nextAmounts)
      setResult(finalResult)
      setIsSharedView(false)
      setScreen('result')
      syncShareUrl(finalResult)
      track('result_reached', { tier: finalResult.tier, percentile: finalResult.overallPercentile })
      return
    }
    persist(index, nextAmounts)
    setStepIndex(index)
    setAmounts(nextAmounts)
    setScreen('input')
  }

  function handleStartFresh() {
    localStorage.removeItem(STORAGE_KEY)
    setHasSavedProgress(false)
    track('game_start')
    goToStep(0, initialCategoryAmounts)
  }

  function handleContinue() {
    const saved = loadSavedProgress()
    if (!saved) {
      handleStartFresh()
      return
    }
    setStepIndex(saved.stepIndex)
    setAmounts(saved.amounts)
    setScreen('input')
  }

  function handleAmountSubmit(amount: number) {
    const nextAmounts = { ...amounts, [currentInput.category]: amount }
    goToStep(stepIndex + 1, nextAmounts)
  }

  function handleRestart() {
    clearShareParams()
    setResult(null)
    setIsSharedView(false)
    setScreen('intro')
    setHasSavedProgress(false)
  }

  return (
    <div className="app-shell">
      {screen === 'intro' && (
        <IntroScreen
          onStart={handleStartFresh}
          hasSavedProgress={hasSavedProgress}
          onContinue={handleContinue}
        />
      )}

      {screen === 'input' && currentInput && (
        <AmountScreen
          config={currentInput}
          index={stepIndex}
          total={categoryInputs.length}
          onSubmit={handleAmountSubmit}
        />
      )}

      {screen === 'result' && result && (
        <ResultScreen result={result} onRestart={handleRestart} isShared={isSharedView} />
      )}
    </div>
  )
}

export default App
