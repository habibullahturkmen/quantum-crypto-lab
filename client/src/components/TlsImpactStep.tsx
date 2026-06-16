import { useEffect, useState } from 'react'
import type { TlsResult } from '../types'

interface Props {
  onPrev: () => void
}

export default function TlsImpactStep({ onPrev }: Props) {
  const [data, setData] = useState<TlsResult | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/tls-impact')
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError('Could not load TLS impact data. Is the server running?'))
  }, [])

  return (
    <section className="demo-step">
      <h2>Step 5 — TLS, PKI &amp; Enterprise Impact</h2>
      <p className="step-desc">
        This is why Google, Cloudflare, and NSA CNSA 2.0 are pushing post-quantum migration now.
      </p>

      {error && <p className="error">{error}</p>}

      {data && (
        <div className="result-card">
          <h3>{data.title}</h3>
          <ul className="tls-list">
            {data.items.map((item) => (
              <li key={item.org}>
                <strong>{item.org}</strong>
                <span>{item.event}</span>
              </li>
            ))}
          </ul>
          <p className="recommendation">{data.recommendation}</p>
        </div>
      )}

      <button type="button" className="btn ghost" onClick={onPrev}>← Back</button>
    </section>
  )
}