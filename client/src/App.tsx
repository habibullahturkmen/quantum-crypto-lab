import { useState } from 'react'
import './App.css'
import StepIndicator from './components/StepIndicator'
import RsaStep from './components/RsaStep'
import ClassicalAttackStep from './components/ClassicalAttackStep'
import QuantumAttackStep from './components/QuantumAttackStep'
import PqcStep from './components/PqcStep'
import TlsImpactStep from './components/TlsImpactStep'
import type { SharedState, StepInfo } from './types'

const STEPS: StepInfo[] = [
  { id: 1, title: 'RSA Encrypt', subtitle: 'Classical cryptography today' },
  { id: 2, title: 'Classical Attack', subtitle: 'GNFS brute force estimate' },
  { id: 3, title: 'Quantum Attack', subtitle: "Shor's algorithm demo" },
  { id: 4, title: 'PQC (Kyber)', subtitle: 'Quantum-resistant encryption' },
  { id: 5, title: 'TLS & PKI Impact', subtitle: 'Real-world migration' },
]

export default function App() {
  const [step, setStep] = useState(1)
  const [shared, setShared] = useState<SharedState>({
    message: 'Hello, Cyber Experts!',
    keyBits: 2048,
  })

  const next = () => setStep((s) => Math.min(s + 1, 5))
  const prev = () => setStep((s) => Math.max(s - 1, 1))

  return (
    <div className="app">
      <header className="app-header">
        <h1>Quantum vs Classical Crypto Lab</h1>
        <p>Cyber Experts — Quantum Computing vs Modern Cryptography</p>
      </header>

      <StepIndicator steps={STEPS} current={step} />

      <main className="app-main">
        {step === 1 && <RsaStep shared={shared} setShared={setShared} onNext={next} />}
        {step === 2 && <ClassicalAttackStep shared={shared} onNext={next} onPrev={prev} />}
        {step === 3 && <QuantumAttackStep onNext={next} onPrev={prev} />}
        {step === 4 && <PqcStep shared={shared} onNext={next} onPrev={prev} />}
        {step === 5 && <TlsImpactStep onPrev={prev} />}
      </main>
    </div>
  )
}