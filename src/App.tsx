import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { IntroScreen } from './components/IntroScreen'
import { QuestionScreen } from './components/QuestionScreen'
import { CandidateScreen } from './components/CandidateScreen'
import { ResultScreen } from './components/ResultScreen'
import { questions } from './data/questions'
import { candidates } from './data/candidates'
import { computeResult, initialPersonalityScores, initialVibeScores } from './game/engine'
import { clearShareParams, parseSharedResult, syncShareUrl } from './game/share'
import type { GameResult, PersonalityScores, PersonalityTrait, Screen, VibeScores } from './types'

type Step =
  | { type: 'question'; data: (typeof questions)[number] }
  | { type: 'candidate'; data: (typeof candidates)[number] }

const STORAGE_KEY = 'love-sim-progress-v1'

interface SavedProgress {
  stepIndex: number
  personality: PersonalityScores
  vibe: VibeScores
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
  const steps = useMemo<Step[]>(() => {
    const result: Step[] = []
    let candidateIndex = 0
    questions.forEach((question, i) => {
      result.push({ type: 'question', data: question })
      if ((i + 1) % 2 === 0 && candidateIndex < candidates.length) {
        result.push({ type: 'candidate', data: candidates[candidateIndex] })
        candidateIndex += 1
      }
    })
    return result
  }, [])

  const [screen, setScreen] = useState<Screen>('intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [personality, setPersonality] = useState<PersonalityScores>(initialPersonalityScores)
  const [vibe, setVibe] = useState<VibeScores>(initialVibeScores)
  const [result, setResult] = useState<GameResult | null>(null)
  const [hasSavedProgress, setHasSavedProgress] = useState(false)
  const [isSharedView, setIsSharedView] = useState(false)

  useEffect(() => {
    const shared = parseSharedResult()
    if (shared) {
      setResult(shared)
      setIsSharedView(true)
      setScreen('result')
      return
    }
    setHasSavedProgress(loadSavedProgress() !== null)
  }, [])

  function persist(nextIndex: number, nextPersonality: PersonalityScores, nextVibe: VibeScores) {
    const data: SavedProgress = { stepIndex: nextIndex, personality: nextPersonality, vibe: nextVibe }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function goToStep(index: number, nextPersonality: PersonalityScores, nextVibe: VibeScores) {
    if (index >= steps.length) {
      localStorage.removeItem(STORAGE_KEY)
      const finalResult = computeResult(nextPersonality, nextVibe)
      setResult(finalResult)
      setIsSharedView(false)
      setScreen('result')
      syncShareUrl(finalResult)
      return
    }
    persist(index, nextPersonality, nextVibe)
    setStepIndex(index)
    setPersonality(nextPersonality)
    setVibe(nextVibe)
    setScreen(steps[index].type)
  }

  function handleStartFresh() {
    localStorage.removeItem(STORAGE_KEY)
    setHasSavedProgress(false)
    goToStep(0, initialPersonalityScores, initialVibeScores)
  }

  function handleContinue() {
    const saved = loadSavedProgress()
    if (!saved) {
      handleStartFresh()
      return
    }
    setStepIndex(saved.stepIndex)
    setPersonality(saved.personality)
    setVibe(saved.vibe)
    setScreen(steps[saved.stepIndex]?.type ?? 'intro')
  }

  function handleQuestionChoice(trait: PersonalityTrait, weight: number) {
    const nextPersonality = { ...personality, [trait]: personality[trait] + weight }
    goToStep(stepIndex + 1, nextPersonality, vibe)
  }

  function handleCandidateDecide(liked: boolean) {
    const step = steps[stepIndex]
    if (step.type !== 'candidate') return
    const nextVibe = liked
      ? { ...vibe, [step.data.vibe]: vibe[step.data.vibe] + step.data.weight }
      : vibe
    goToStep(stepIndex + 1, personality, nextVibe)
  }

  function handleRestart() {
    clearShareParams()
    setResult(null)
    setIsSharedView(false)
    setScreen('intro')
    setHasSavedProgress(false)
  }

  const currentStep = steps[stepIndex]

  return (
    <div className="app-shell">
      {screen === 'intro' && (
        <IntroScreen
          onStart={handleStartFresh}
          hasSavedProgress={hasSavedProgress}
          onContinue={handleContinue}
        />
      )}

      {screen === 'question' && currentStep?.type === 'question' && (
        <QuestionScreen
          question={currentStep.data}
          index={questions.findIndex((q) => q.id === currentStep.data.id)}
          total={questions.length}
          onChoose={(choice) => handleQuestionChoice(choice.trait, choice.weight)}
        />
      )}

      {screen === 'candidate' && currentStep?.type === 'candidate' && (
        <CandidateScreen candidate={currentStep.data} onDecide={handleCandidateDecide} />
      )}

      {screen === 'result' && result && (
        <ResultScreen result={result} onRestart={handleRestart} isShared={isSharedView} />
      )}
    </div>
  )
}

export default App
