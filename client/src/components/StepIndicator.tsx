import type { StepInfo } from '../types'

interface Props {
  steps: StepInfo[]
  current: number
  onStepSelect: (id: number) => void
}

export default function StepIndicator({ steps, current, onStepSelect }: Props) {
  return (
    <nav className="step-indicator" aria-label="Demo steps">
      {steps.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`step-item ${current === s.id ? 'active' : ''} ${current > s.id ? 'done' : ''}`}
          onClick={() => onStepSelect(s.id)}
          aria-current={current === s.id ? 'step' : undefined}
        >
          <div className="step-circle">{s.id}</div>
          <div className="step-text">
            <strong>{s.title}</strong>
            <span>{s.subtitle}</span>
          </div>
        </button>
      ))}
    </nav>
  )
}