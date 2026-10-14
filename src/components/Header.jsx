import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { menuLinks, menuToggleLabel } from '../data/menu.js'
import Icon from './Icon.jsx'
import Signature from './Signature.jsx'

export default function Header() {
  const { t, lang, setLang } = useLanguage()
  const [navOpen, setNavOpen] = useState(false) // menu hambúrguer (mobile)
  const [menuOpen, setMenuOpen] = useState(false) // sanfona da assinatura
  const brandRef = useRef(null)

  const closeAll = () => {
    setNavOpen(false)
    setMenuOpen(false)
  }

  // Sanfona: fecha ao clicar fora ou ao apertar Esc.
  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target)) setMenuOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const links = [
    { to: '/', label: t.nav.about, end: true },
    { to: '/projetos', label: t.nav.projects },
    { to: '/experiencias', label: t.nav.experiences },
    { to: '/contato', label: t.nav.contact },
  ]

  return (
    <header className="header">
      <div className="header__inner">
        <button
          type="button"
          className="header__toggle"
          aria-expanded={navOpen}
          aria-label="Menu"
          onClick={() => {
            setNavOpen((o) => !o)
            setMenuOpen(false)
          }}
        >
          ☰
        </button>

        {/* Opções à esquerda */}
        <nav className={`header__nav ${navOpen ? 'is-open' : ''}`}>
          <button
            type="button"
            className="lang-toggle"
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          >
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={closeAll}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Assinatura à direita: ao clicar abre/fecha o menu sanfona */}
        <div className="header__brandwrap" ref={brandRef}>
          <button
            type="button"
            className="header__brand"
            aria-expanded={menuOpen}
            aria-controls="header-menu"
            aria-label={menuToggleLabel[lang]}
            onClick={() => {
              setMenuOpen((o) => !o)
              setNavOpen(false)
            }}
          >
            <Signature />
          </button>

          <div id="header-menu" className={`header__menu ${menuOpen ? 'is-open' : ''}`}>
            <ul>
              {menuLinks.map((l) => (
                <li key={l.id}>
                  <a href={l.href} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>
                    <Icon name={l.id} size={20} />
                    <span>{l.label[lang]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
