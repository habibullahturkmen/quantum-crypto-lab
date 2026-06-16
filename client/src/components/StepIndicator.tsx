import type { StepInfo } from '../types'

interface Props {
  steps: StepInfo[]
  current: number
}

export default function StepIndicator({ steps, current }: Props) {
  return (
    <nav className="step-indicator" aria-label="Demo steps">
      {steps.map((s) => (
        <div
          key={s.id}
          className={`step-item ${current === s.id ? 'active' : ''} ${current > s.id ? 'done' : ''}`}
        >
          <div className="step-circle">{s.id}</div>
          <div className="step-text">
            <strong>{s.title}</strong>
            <span>{s.subtitle}</span>
          </div>
        </div>
      ))}
    </nav>
  )
}