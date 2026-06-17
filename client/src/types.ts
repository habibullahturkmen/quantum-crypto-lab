export interface SharedState {
  message: string
  keyBits: number
  ciphertext?: string
  algorithm?: string
}

export interface StepInfo {
  id: number
  title: string
  subtitle: string
}

export interface RsaResult {
  algorithm: string
  ciphertext: string
  keyBits: number
  messagePreview: string
  note: string
}

export interface ClassicalResult {
  keyBits: number
  algorithm: string
  estimatedYears: number
  unit: string
  verdict: string
  comparison: string
}

export interface QuantumResult {
  algorithm: string
  modulus: number
  factors: number[]
  steps: string[]
  timeSeconds: number
  verdict: string
  realWorldNote: string
}

export interface PqcResult {
  algorithm: string
  ciphertext: string
  kemCiphertext: string
  iv: string
  tag: string
  quantumResistant: boolean
  nistStatus: string
  note: string
}

export interface TlsEntry {
  label?: string
  text: string
}

export interface TlsSection {
  heading: string
  entries: TlsEntry[]
}

export interface TlsResult {
  title: string
  sections: TlsSection[]
  recommendation: string
}