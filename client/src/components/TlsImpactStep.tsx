import { useEffect, useState } from 'react'
import PlainEnglish from './PlainEnglish'
import { STEP_PLAIN } from '../content/stepCopy'
import type { TlsResult } from '../types'

interface Props {
  onRestart: () => void
}

export default function TlsImpactStep({ onRestart }: Props) {
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
      <PlainEnglish>{STEP_PLAIN[5]}</PlainEnglish>
      <p className="step-desc">
        Real-world case studies, migration challenges, risks, and defensive strategies —
        aligned with our presentation on VPNs, PKI, and TLS.
      </p>

      {error && <p className="error">{error}</p>}

      {data && (
        <div className="result-card">
          <h3>{data.title}</h3>

          {data.sections.map((section) => (
            <div key={section.heading} className="tls-section">
              <h4 className="tls-section-heading">{section.heading}</h4>
              <ul className="tls-list">
                {section.entries.map((entry) => (
                  <li key={entry.label ?? entry.text}>
                    {entry.label ? (
                      <>
                        <strong>{entry.label}</strong>
                        <span>{entry.text}</span>
                      </>
                    ) : (
                      <span>{entry.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="recommendation">{data.recommendation}</p>
        </div>
      )}

      <button type="button" className="btn" onClick={onRestart}>Start over from Step 1 →</button>
    </section>
  )
}
