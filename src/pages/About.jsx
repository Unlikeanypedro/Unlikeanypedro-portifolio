import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { profile } from '../data/profile.js'
import foto from '../assets/images/FotoPerfil.png'

export default function About() {
  const { t } = useLanguage()
  return (
    <section className="about">
      <div className="about__text">
        <h1>{profile.name}</h1>
        <p className="about__role">{t.about.role}</p>
        <p>{t.about.text}</p>
        <Link to="/projetos" className="btn">
          {t.about.cta}
        </Link>
      </div>
      <div className="about__photo">
        <img src={foto} alt="Foto Pedro Oliveira" className="about__photo-img" />
      </div>
    </section>
  )
}
