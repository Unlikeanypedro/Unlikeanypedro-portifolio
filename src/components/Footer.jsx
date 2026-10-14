import { useLanguage } from '../context/LanguageContext.jsx'
import { profile, contactLinks } from '../data/profile.js'
import Icon from './Icon.jsx'
import Signature from './Signature.jsx'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="footer">
      <div className="footer__inner">
        <Signature className="footer__sign" />
        <div className="footer__links">
          {contactLinks.map((l) => (
            <a key={l.id} href={l.href} target="_blank" rel="noreferrer" aria-label={l.label}>
              <Icon name={l.id} />
            </a>
          ))}
        </div>
        <p className="footer__copy">
          © {profile.year} · {t.footer}
        </p>
      </div>
    </footer>
  )
}
