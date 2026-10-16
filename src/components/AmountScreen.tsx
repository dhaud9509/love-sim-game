import { useState } from 'react'
import type { CategoryInputConfig } from '../types'

interface AmountScreenProps {
  config: CategoryInputConfig
  index: number
  total: number
  onSubmit: (amount: number) => void
}

export function AmountScreen({ config, index, total, onSubmit }: AmountScreenProps) {
  const [value, setValue] = useState('')

  const parsed = Number(value)
  const isValid = value.trim() !== '' && Number.isFinite(parsed) && parsed >= 0

  function handleSubmit() {
    if (!isValid) return
    onSubmit(parsed)
  }

  return (
    <div className="screen amount-screen">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <p className="eyebrow">
        {index + 1} / {total} · {config.title}
      </p>
      <h2>{config.prompt}</h2>

      <div className="amount-input-row">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={value}
          placeholder={config.placeholder}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit()
          }}
          className="amount-input"
        />
        <span className="amount-unit">{config.unit}</span>
      </div>
      <p className="amount-helper">{config.helper}</p>

      <button className="primary-button" onClick={handleSubmit} disabled={!isValid}>
        다음
      </button>
    </div>
  )
}
