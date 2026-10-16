import { useEffect, useMemo, useState } from 'react'
import { track } from '@vercel/analytics'
import './App.css'
import { IntroScreen } from './components/IntroScreen'
import { QuestionScreen } from './components/QuestionScreen'
import { ResultScreen } from './components/ResultScreen'
import { questions } from './data/questions'
import { computeResult, initialCategoryScores } from './game/engine'
import { clearShareParams, parseSharedResult, syncShareUrl } from './game/share'
import type { CategoryScores, FinanceCategory, GameResult, Screen } from './types'

const STORAGE_KEY = 'wealth-test-progress-v1'

interface SavedProgress {
  stepIndex: number
  scores: CategoryScores
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
  const [scores, setScores] = useState<CategoryScores>(initialCategoryScores)
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

  const currentQuestion = useMemo(() => questions[stepIndex], [stepIndex])

  function persist(nextIndex: number, nextScores: CategoryScores) {
    const data: SavedProgress = { stepIndex: nextIndex, scores: nextScores }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function goToStep(index: number, nextScores: CategoryScores) {
    if (index >= questions.length) {
      localStorage.removeItem(STORAGE_KEY)
      const finalResult = computeResult(nextScores)
      setResult(finalResult)
      setIsSharedView(false)
      setScreen('result')
      syncShareUrl(finalResult)
      track('result_reached', { tier: finalResult.tier, percentile: finalResult.overallPercentile })
      return
    }
    persist(index, nextScores)
    setStepIndex(index)
    setScores(nextScores)
    setScreen('question')
  }

  function handleStartFresh() {
    localStorage.removeItem(STORAGE_KEY)
    setHasSavedProgress(false)
    track('game_start')
    goToStep(0, initialCategoryScores)
  }

  function handleContinue() {
    const saved = loadSavedProgress()
    if (!saved) {
      handleStartFresh()
      return
    }
    setStepIndex(saved.stepIndex)
    setScores(saved.scores)
    setScreen('question')
  }

  function handleQuestionChoice(category: FinanceCategory, score: number) {
    const nextScores = { ...scores, [category]: scores[category] + score }
    goToStep(stepIndex + 1, nextScores)
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

      {screen === 'question' && currentQuestion && (
        <QuestionScreen
          question={currentQuestion}
          index={stepIndex}
          total={questions.length}
          onChoose={(choice) => handleQuestionChoice(currentQuestion.category, choice.score)}
        />
      )}

      {screen === 'result' && result && (
        <ResultScreen result={result} onRestart={handleRestart} isShared={isSharedView} />
      )}
    </div>
  )
}

export default App
