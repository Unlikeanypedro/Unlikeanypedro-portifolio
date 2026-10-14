// Bloco cinza que marca ONDE entra uma imagem/GIF. Remova quando colocar a imagem real.
export default function Placeholder({ label }) {
  return (
    <div className="image-block" style={{ height: '100%' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="1" />
        <circle cx="9" cy="10" r="1.5" />
        <path d="M3 18l6-5 4 3 3-2 5 4" />
      </svg>
      {label && <span>{label}</span>}
    </div>
  )
}
