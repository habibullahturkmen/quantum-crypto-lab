import { useState } from 'react'
import type { SharedState, RsaResult } from '../types'

interface Props {
  shared: SharedState
  setShared: React.Dispatch<React.SetStateAction<SharedState>>
  onNext: () => void
}

export default function RsaStep({ shared, setShared, onNext }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RsaResult | null>(null)
  const [error, setError] = useState('')

  async function handleEncrypt() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/rsa/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: shared.message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Encryption failed')
      setResult(data)
      setShared((prev) => ({
        ...prev,
        keyBits: data.keyBits,
        ciphertext: data.ciphertext,
        algorithm: data.algorithm,
      }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="demo-step">
      <h2>Step 1 — Encrypt with RSA</h2>
      <p className="step-desc">
        RSA-2048 is used today in TLS handshakes, VPN certificates, and PKI.
        Encrypt a message to see classical cryptography in action.
      </p>

      <label className="field-label" htmlFor="message">
        Message to encrypt
      </label>
      <input
        id="message"
        className="text-input"
        value={shared.message}
        onChange={(e) => setShared((prev) => ({ ...prev, message: e.target.value }))}
        placeholder="Hello, Cyber Experts!"
      />

      <button type="button" className="btn primary" onClick={handleEncrypt} disabled={loading}>
        {loading ? 'Encrypting…' : 'Encrypt with RSA-2048'}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-card">
          <div className="badge classical">Classical Crypto</div>
          <p><strong>Algorithm:</strong> {result.algorithm}</p>
          <p><strong>Plaintext:</strong> {result.messagePreview}</p>
          <p className="mono-label">Ciphertext (base64):</p>
          <pre className="code-block">{result.ciphertext.slice(0, 120)}…</pre>
          <p className="note">{result.note}</p>
          <button type="button" className="btn" onClick={onNext}>
            Next: Classical Attack →
          </button>
        </div>
      )}
    </section>
  )
}