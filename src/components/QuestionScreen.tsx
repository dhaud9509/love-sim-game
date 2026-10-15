import type { Question, QuestionChoice } from '../types'

interface QuestionScreenProps {
  question: Question
  index: number
  total: number
  onChoose: (choice: QuestionChoice) => void
}

export function QuestionScreen({ question, index, total, onChoose }: QuestionScreenProps) {
  return (
    <div className="screen question-screen">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <p className="eyebrow">Q{index + 1} / {total}</p>
      <p className="scene-text">{question.scene}</p>
      <h2>{question.prompt}</h2>
      <div className="choice-list">
        {question.choices.map((choice) => (
          <button key={choice.text} className="choice-button" onClick={() => onChoose(choice)}>
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  )
}
