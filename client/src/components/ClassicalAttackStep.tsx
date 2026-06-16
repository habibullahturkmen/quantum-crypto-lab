import { useEffect, useState } from 'react'
import type { SharedState, ClassicalResult } from '../types'

interface Props {
  shared: SharedState
  onNext: () => void
  onPrev: () => void
}

function formatYears(years: number): string {
  if (years >= 1e12) return `${(years / 1e12).toFixed(0)} trillion`
  if (years >= 1e9) return `${(years / 1e9).toFixed(0)} billion`
  if (years >= 1e6) return `${(years / 1e6).toFixed(0)} million`
  return years.toLocaleString()
}

export default function ClassicalAttackStep({ shared, onNext, onPrev }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClassicalResult | null>(null)
  const [displayYears, setDisplayYears] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!result) return
    const target = result.estimatedYears
    const duration = 2500
    const start = performance.now()

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      setDisplayYears(Math.floor(target * progress))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [result])

  async function handleAttack() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/classical-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyBits: shared.keyBits || 2048 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="demo-step">
      <h2>Step 2 — Classical Attack (GNFS)</h2>
      <p className="step-desc">
        The General Number Field Sieve is the best known classical algorithm for factoring
        large RSA moduli. Watch how long it would take to break RSA-{shared.keyBits || 2048}.
      </p>

      <button type="button" className="btn primary" onClick={handleAttack} disabled={loading}>
        {loading ? 'Estimating…' : 'Run Classical Factorization Attack'}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-card">
          <div className="badge warning">Brute Force</div>
          <p><strong>Algorithm:</strong> {result.algorithm}</p>
          <p><strong>Target key size:</strong> RSA-{result.keyBits}</p>

          <div className="timer-display">
            <span className="timer-value">{formatYears(displayYears)}</span>
            <span className="timer-unit">{result.unit}</span>
          </div>

          <p>{result.verdict}</p>
          <p className="note">{result.comparison}</p>

          <div className="nav-buttons">
            <button type="button" className="btn ghost" onClick={onPrev}>← Back</button>
            <button type="button" className="btn" onClick={onNext}>Next: Quantum Attack →</button>
          </div>
        </div>
      )}
    </section>
  )
}