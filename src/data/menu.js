import { contactLinks } from './profile.js'

// Reaproveita os links que já existem em profile.js (contactLinks).
const url = (id) => contactLinks.find((l) => l.id === id)?.href

// Itens do menu sanfona que abre ao clicar na assinatura (cabeçalho).
// `id` precisa existir em components/Icon.jsx.
export const menuLinks = [
  // TODO: troque SEU_USUARIO pelo seu @ do Instagram.
  { id: 'instagram', label: { pt: 'Instagram', en: 'Instagram' }, href: 'https://www.instagram.com/unlikeanypedro' },
  { id: 'linkedin', label: { pt: 'LinkedIn', en: 'LinkedIn' }, href: url('linkedin') },
  // Repositório: usa o mesmo link do GitHub de profile.js
  { id: 'github', label: { pt: 'GitHub', en: 'GitHub' }, href: url('github') },
  // TODO: coloque o PDF em public/curriculo.pdf (ou troque o href por outro link).
  { id: 'resume', label: { pt: 'Currículo', en: 'Resume' }, href: '/curriculo.pdf' },
]

export const menuToggleLabel = {
  pt: 'Abrir links e currículo',
  en: 'Open links and résumé',
}
