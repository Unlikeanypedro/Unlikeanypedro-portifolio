// Bloco tracejado que marca ONDE entra uma imagem/GIF. Remova quando colocar a imagem real.
export default function Placeholder({ label, ratio = '16 / 9' }) {
  return (
    <div className="placeholder" style={{ aspectRatio: ratio }}>
      <span>{label}</span>
    </div>
  )
}
