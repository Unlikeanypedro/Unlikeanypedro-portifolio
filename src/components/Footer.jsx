import { useLanguage } from '../context/LanguageContext.jsx'
import { profile, contactLinks } from '../data/profile.js'
import Icon from './Icon.jsx'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>
          © {profile.year} {profile.name}. {t.footer}
        </p>
        <div className="footer__links">
          {contactLinks.map((l) => (
            <a key={l.id} href={l.href} target="_blank" rel="noreferrer" aria-label={l.label}>
              <Icon name={l.id} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
