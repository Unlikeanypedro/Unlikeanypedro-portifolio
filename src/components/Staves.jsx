import { useEffect, useRef, useState } from 'react'

// Fundo de caderno de música: vários sistemas (pauta de sol + pauta de fá, ligados
// por chave e barra) repetidos pela página inteira. As claves são desenhadas à mão
// em SVG, então não dependem de nenhuma fonte.
//
// PARTITURA PRÓPRIA: se você colocar uma imagem da sua partitura em
//   src/assets/partitura.png   (ou .jpg / .webp / .svg)
// ela passa a ser o fundo no lugar das pautas vazias (o branco da imagem some,
// fica só a tinta sobre o papel amarelado). Se o arquivo não existir, aparecem as pautas.
// Obs.: use só partituras que você tenha direito de publicar.
const scoreFiles = import.meta.glob('../assets/partitura.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const scoreUrl = Object.values(scoreFiles)[0]

// Para ajustar o tamanho das pautas, mexa em SYSTEM_H (altura de cada sistema) e no CSS
// `.system__staff` (altura 53px, espaço entre linhas 13px).
const SYSTEM_H = 176

function System() {
  return (
    <div className="system">
      <div className="system__staff system__staff--treble" />
      <div className="system__staff system__staff--bass" />
      <svg
        className="system__marks"
        width="80"
        height={SYSTEM_H}
        viewBox={`0 0 80 ${SYSTEM_H}`}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* barra que liga as duas pautas */}
        <line x1="16" y1="20" x2="16" y2="156" strokeWidth="1.6" />

        {/* chave de piano */}
        <path
          fill="currentColor"
          stroke="none"
          d="M15 20C9 22 9.5 30 9.5 40C9.5 56 9.5 66 8 74C6.5 82 3 84 2 88C3 92 6.5 94 8 102C9.5 110 9.5 120 9.5 136C9.5 146 9 154 15 156C12 152 12.5 146 12.5 136C12.5 120 12 110 10.5 102C9 95 5.5 92 4.5 88C5.5 84 9 81 10.5 74C12 66 12.5 56 12.5 40C12.5 30 12 24 15 20Z"
        />

        {/* clave de sol */}
        <g transform="translate(22 20) scale(1.3)" strokeWidth="1.5">
          <path d="M12 46 L15.5 -9 C16.5 -14 22 -12 21 -3 C20 5 12 12 7 20 C3 24 .5 30 3 35 C5.5 40 13 42 19 38 C24 34.5 26 27 21 21.5 C17.5 17.5 10.5 19 9.5 25 C8.7 30 13.5 33 16 29 C17.5 26 14.5 23.5 12.5 26" />
          <path d="M12 44 C12.5 50 12 54 8.5 54.5 C5.5 55 4.5 51 7 49.5" />
          <circle cx="7.4" cy="50.6" r="1.9" fill="currentColor" stroke="none" />
        </g>

        {/* clave de fá */}
        <g transform="translate(22 106) scale(1.15)">
          <path
            fill="currentColor"
            stroke="none"
            d="M4 9C3 -1 22 -3 23 11C24 24 14 33 2 38C12 30 18 24 17 12C16 4 8 3 8 11Z"
          />
          <circle cx="6" cy="10.5" r="2.8" fill="currentColor" stroke="none" />
          <circle cx="26" cy="4.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="26" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
        </g>
      </svg>
    </div>
  )
}

export default function Staves() {
  const ref = useRef(null)
  const [count, setCount] = useState(8)

  // Repete os sistemas até cobrir a altura da página (acompanha a troca de rota).
  useEffect(() => {
    if (scoreUrl) return
    const host = ref.current?.parentElement
    if (!host || typeof ResizeObserver === 'undefined') return
    const update = () => setCount(Math.max(6, Math.ceil(host.clientHeight / SYSTEM_H) + 1))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  if (scoreUrl) {
    return (
      <div
        className="staves staves--score"
        style={{ backgroundImage: `url(${scoreUrl})` }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div className="staves" ref={ref} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <System key={i} />
      ))}
    </div>
  )
}
