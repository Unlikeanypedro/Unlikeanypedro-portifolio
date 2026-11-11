import { useLanguage } from "../context/LanguageContext.jsx";
import Ornament from "../components/Ornament.jsx";
import { experiences } from "../data/experiences.js";

export default function Experiences() {
    const { lang, t } = useLanguage();

    return (
        <div className="page">
            <header className="page-head">
                <span className="page-head__kicker">
                    03 — {t.nav.experiences}
                </span>
                <h1>{t.experiences.title}</h1>
                <p className="page-head__sub">{t.experiences.subtitle}</p>
                <Ornament />
            </header>

            <ol className="timeline">
                {experiences.map((exp) => (
                    <li className="timeline__item" key={exp.id}>
                        <span className="timeline__num">
                            {String(exp.id).padStart(2, "0")}
                        </span>
                        <div className="timeline__body">
                            <h2>{exp.organization}</h2>
                            <p className="timeline__role">{exp.role[lang]}</p>
                            <p className="text">{exp.description[lang]}</p>
                        </div>
                        <span className="timeline__period">{exp.period}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
