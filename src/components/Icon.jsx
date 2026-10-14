// Ícones simples em SVG. Para usar uma lib (ex.: react-icons), edite só este arquivo.
const paths = {
  email: 'M3 5h18v14H3zM3 5l9 7 9-7',
  whatsapp: 'M4 20l1.3-4.2A8 8 0 1 1 8.3 18.8L4 20z',
  linkedin: 'M4 9h4v11H4zM6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v1.6c.6-1 1.8-1.9 3.5-1.9 3 0 3.5 2 3.5 4.5V20h-4v-5.8c0-1.3-.1-2.4-1.5-2.4S14 12.9 14 14.2V20h-4z',
  github: 'M9 19c-4 1.5-4-2-6-2.500M15 22v-3.900a3.400 3.400 0 0 0-1-2.600c3.100-.3 6.400-1.500 6.400-6.900a5.300 5.300 0 0 0-1.500-3.700 5 5 0 0 0-.1-3.700s-1.200-.4-3.900 1.400a13.400 13.400 0 0 0-7 0C6.200 2.100 5 2.500 5 2.500a5 5 0 0 0-.1 3.700A5.300 5.300 0 0 0 3.400 9.900c0 5.400 3.300 6.600 6.400 6.900a3.400 3.400 0 0 0-1 2.600V22',
  instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01',
  resume: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
}

export default function Icon({ name, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || ''} />
    </svg>
  )
}
