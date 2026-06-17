interface Props {
  children: React.ReactNode
}

export default function PlainEnglish({ children }: Props) {
  return (
    <div className="plain-english">
      <p className="plain-english-label">In simple terms</p>
      <p className="plain-english-text">{children}</p>
    </div>
  )
}
