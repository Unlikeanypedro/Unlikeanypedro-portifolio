import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import Ornament from "../components/Ornament.jsx";
import photo from "../assets/images/FotoPerfil.png";

export default function About() {
    const { t } = useLanguage();

    return (
        <div className="page">
            <header className="page-head">
                <span className="page-head__kicker">01 — {t.nav.about}</span>
                <h1>{t.about.title}</h1>
                <Ornament />
            </header>

            <div className="about">
                <figure className="about__portrait">
                    <img src={photo} alt="Pedro Oliveira" />
                </figure>

                <div className="about__body">
                    <p className="about__role">{t.about.role}</p>
                    <p className="text">{t.about.text}</p>
                    <blockquote className="about__quote">
                        <span className="quote-mark">“</span>
                        {t.about.quote}
                    </blockquote>
                    <Link to="/projetos" className="btn">
                        {t.about.cta}
                    </Link>
                </div>
            </div>
        </div>
    );
}
