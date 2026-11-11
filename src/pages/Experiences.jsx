import { useLanguage } from "../context/LanguageContext.jsx";
import Ornament from "../components/Ornament.jsx";
import { experiences } from "../data/experiences.js";

// Converte períodos como "03/2025 – 03/2026" ou "2026 – Atual"
// em um número comparável (ano * 100 + mês) para ordenar cronologicamente.
function startKey(period = "") {
    const monthYear = period.match(/(\d{2})\/(\d{4})/);
    if (monthYear) {
        return Number(monthYear[2]) * 100 + Number(monthYear[1]);
    }
    const year = period.match(/(\d{4})/);
    return year ? Number(year[1]) * 100 : 0;
}

export default function Experiences() {
    const { lang, t } = useLanguage();

    const ordered = [...experiences].sort(
        (a, b) => startKey(a.period) - startKey(b.period),
    );

    return (
        <div className="page experiences-page">
            <header className="page-head">
                <span className="page-head__kicker">
                    03 — {t.nav.experiences}
                </span>
                <h1>{t.experiences.title}</h1>
                <p className="page-head__sub">{t.experiences.subtitle}</p>
                <Ornament />
            </header>

            <ol className="timeline">
                {ordered.map((exp, i) => (
                    <li
                        key={exp.id}
                        className={`timeline__row ${i % 2 === 0 ? "is-left" : "is-right"}`}
                    >
                        <article className="timeline__card">
                            <span className="timeline__period">{exp.period}</span>
                            <h2>{exp.organization}</h2>
                            <p className="timeline__role">{exp.role[lang]}</p>
                            <p className="timeline__desc">
                                {exp.description[lang]}
                            </p>
                        </article>
                        <span className="timeline__dot" aria-hidden="true" />
                    </li>
                ))}
            </ol>
        </div>
    );
}
