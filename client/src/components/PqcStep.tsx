import { useState } from 'react'
import PlainEnglish from './PlainEnglish'
import { STEP_PLAIN } from '../content/stepCopy'
import type { SharedState, PqcResult } from '../types'

interface Props {
  shared: SharedState
  onNext: () => void
  onPrev: () => void
}

export default function PqcStep({ shared, onNext, onPrev }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PqcResult | null>(null)
  const [error, setError] = useState('')

  async function handleEncrypt() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/pqc/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: shared.message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Encryption failed')
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="demo-step">
      <h2>Step 4 — Post-Quantum Cryptography (Kyber)</h2>
      <PlainEnglish>{STEP_PLAIN[4]}</PlainEnglish>
      <p className="step-desc">
        ML-KEM-768 (CRYSTALS-Kyber) is NIST-standardized and designed to resist
        both classical and quantum attacks. Encrypt the same message with PQC.
      </p>

      <p><strong>Message:</strong> {shared.message}</p>

      <button type="button" className="btn primary" onClick={handleEncrypt} disabled={loading}>
        {loading ? 'Encrypting…' : 'Encrypt with ML-KEM-768 (Kyber)'}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-card">
          <div className="badge safe">Quantum-Resistant</div>
          <p><strong>Algorithm:</strong> {result.algorithm}</p>
          <p><strong>NIST status:</strong> {result.nistStatus}</p>
          <p className="mono-label">Encrypted payload (base64):</p>
          <pre className="code-block">{result.ciphertext.slice(0, 80)}…</pre>
          <p className="note">{result.note}</p>

          <div className="nav-buttons">
            <button type="button" className="btn ghost" onClick={onPrev}>← Back</button>
            <button type="button" className="btn" onClick={onNext}>Next: TLS &amp; PKI Impact →</button>
          </div>
        </div>
      )}
    </section>
  )
}
