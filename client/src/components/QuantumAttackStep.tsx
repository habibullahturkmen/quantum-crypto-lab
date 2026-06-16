import { useEffect, useState } from 'react'
import type { QuantumResult } from '../types'

interface Props {
  onNext: () => void
  onPrev: () => void
}

export default function QuantumAttackStep({ onNext, onPrev }: Props) {
  const [modulus, setModulus] = useState(15)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<QuantumResult | null>(null)
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!result) return
    const interval = setInterval(() => {
      setVisibleSteps((v) => {
        if (v >= result.steps.length) {
          clearInterval(interval)
          return v
        }
        return v + 1
      })
    }, 400)
    return () => clearInterval(interval)
  }, [result])

  async function handleAttack() {
    setLoading(true)
    setError('')
    setResult(null)
    setVisibleSteps(0)
    try {
      const res = await fetch('/api/quantum-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modulus }),
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
      <h2>Step 3 — Quantum Attack (Shor&apos;s Algorithm)</h2>
      <p className="step-desc">
        Shor&apos;s algorithm factors integers exponentially faster on a quantum computer.
        Demo uses small N (educational only — real RSA-2048 is not breakable yet).
      </p>

      <label className="field-label" htmlFor="modulus">
        Semiprime N to factor
      </label>
      <select
        id="modulus"
        className="text-input"
        value={modulus}
        onChange={(e) => setModulus(Number(e.target.value))}
      >
        <option value={15}>15 (3 × 5) — classic demo</option>
        <option value={21}>21 (3 × 7)</option>
        <option value={35}>35 (5 × 7)</option>
        <option value={77}>77 (7 × 11)</option>
      </select>

      <button type="button" className="btn primary" onClick={handleAttack} disabled={loading}>
        {loading ? 'Running Shor\'s…' : "Run Shor's Algorithm"}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-card">
          <div className="badge quantum">Quantum</div>
          <p><strong>Algorithm:</strong> {result.algorithm}</p>
          <p><strong>Completed in:</strong> ~{result.timeSeconds}s (simulated)</p>

          <ul className="shor-steps">
            {result.steps.slice(0, visibleSteps).map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>

          {result.factors.length === 2 && (
            <p className="factor-result">
              <strong>Factors found:</strong> {result.factors[0]} × {result.factors[1]} = {result.modulus}
            </p>
          )}

          <p>{result.verdict}</p>
          <p className="note">{result.realWorldNote}</p>

          <div className="nav-buttons">
            <button type="button" className="btn ghost" onClick={onPrev}>← Back</button>
            <button type="button" className="btn" onClick={onNext}>Next: Post-Quantum Crypto →</button>
          </div>
        </div>
      )}
    </section>
  )
}