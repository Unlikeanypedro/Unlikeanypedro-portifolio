import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import Ornament from "../components/Ornament.jsx";
import fotoPerfil from "../assets/images/FotoPerfil.png";

export default function About() {
    const { lang, t } = useLanguage();

    return (
        <div className="page about-page">
            <header className="page-head">
                <span className="page-head__kicker">01 — {t.nav.about}</span>
                <h1>{t.about.title}</h1>
                <Ornament />
            </header>

            <div className="about">
                <div className="about__body">
                    <p className="about__role">{t.about.role}</p>
                    <p className="text about__text">{t.about.text}</p>
                    <blockquote className="about__quote">
                        <span className="quote-mark" aria-hidden="true">
                            &ldquo;
                        </span>
                        {t.about.quote}
                    </blockquote>
                    <div className="about__actions">
                        <Link to="/projetos" className="btn">
                            {t.about.cta}
                        </Link>
                        <a
                            className="btn btn--ghost"
                            href="/curriculo.pdf"
                            download="Pedro-Oliveira-Curriculo.pdf"
                        >
                            {t.about.downloadResume}
                            <span aria-hidden="true">↓</span>
                        </a>
                    </div>
                </div>

                <figure className="about__portrait">
                    <img src={fotoPerfil} alt="Pedro Oliveira" />
                </figure>
            </div>
        </div>
    );
}
