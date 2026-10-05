import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { profile } from '../data/profile.js'

export default function Header() {
  const { t, lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const links = [
    { to: '/', label: t.nav.about, end: true },
    { to: '/projetos', label: t.nav.projects },
    { to: '/experiencias', label: t.nav.experiences },
    { to: '/contato', label: t.nav.contact },
  ]

  return (
    <header className="header">
      <div className="header__inner">
        {/* TODO: troque o nome por um logo/monograma se quiser */}
        <NavLink to="/" className="header__brand" onClick={close}>
          {profile.name}
        </NavLink>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>

        <nav className={`header__nav ${open ? 'is-open' : ''}`}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={close}>
              {l.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="lang-toggle"
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          >
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
        </nav>
      </div>
    </header>
  )
}
