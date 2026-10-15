import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { profile, contactLinks } from '../data/profile.js'
import Signature from '../components/Signature.jsx'
import foto from '../assets/images/FotoPerfil.png'

export default function About() {
  const { t } = useLanguage()
  return (
    <>
      {/* Capa */}
      <section className="sheet cover">
        <div className="cover__left">
          <div className="cover__quote">
            <span className="quote-mark" aria-hidden="true">”</span>
            <p className="text">{t.about.quote}</p>
          </div>
        </div>

        <div className="cover__main">
          <h1 className="cover__name">
            <Signature />
          </h1>
          <p className="cover__role">{t.about.role}</p>
          <p className="cover__title">
            {t.about.coverTitle}
            <small>{profile.year} ——</small>
          </p>
          <Link to="/projetos" className="btn">
            {t.about.cta}
          </Link>
        </div>

        <div className="cover__photo">
          <div className="image-block">
            <img src={foto} alt={`Foto ${profile.name}`} />
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="sheet about-sheet">
        <div className="about-sheet__box">
          <h2>{t.about.title}</h2>
          <p className="text">{t.about.text}</p>
        </div>

        <div className="about-sheet__player">
          <div className="music-player">
            <span className="music-player__eyebrow">
              NOW PLAYING — feora-vgm-yume-bone-bottom-hollow-knight-silksong-lofi
            </span>

            <div className="music-player__art">
              <span aria-hidden="true">𝄞</span>
            </div>

            <h3>Uma música para acompanhar</h3>
            <p>Trilha sonora do meu portfólio</p>

            <audio controls preload="metadata">
              <source src="/audio/51383504-feora-vgm-yume-bone-bottom-hollow-knight-silksong-lofi-421667.mp3" type="audio/mpeg" />
              Seu navegador não suporta áudio.
            </audio>

            <span className="music-player__caption">
              SELEÇÃO PESSOAL
            </span>
          </div>
        </div>
      </section>

    </>
  )
}
