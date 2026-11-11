import { useLanguage } from "../context/LanguageContext.jsx";
import Ornament from "../components/Ornament.jsx";
import { projects } from "../data/projects.js";

export default function Projects() {
    const { lang, t } = useLanguage();

    return (
        <div className="page">
            <header className="page-head">
                <span className="page-head__kicker">02 — {t.nav.projects}</span>
                <h1>{t.projects.title}</h1>
                <p className="page-head__sub">{t.projects.subtitle}</p>
                <Ornament />
            </header>

            <div className="projects">
                {projects.map((project) => (
                    <article className="project" key={project.id}>
                        <div className="project__media">
                            <img
                                src={project.image}
                                alt={project.name[lang]}
                                loading="lazy"
                            />
                        </div>

                        <div className="project__body">
                            <span className="project__date">{project.date}</span>
                            <h2>{project.name[lang]}</h2>
                            <p className="text">{project.description[lang]}</p>
                            <p className="project__techs">
                                <strong>{t.projects.techs}:</strong>{" "}
                                {project.techs.join(" · ")}
                            </p>
                            {project.repo && (
                                <a
                                    className="btn btn--ghost"
                                    href={project.repo}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {t.projects.repo}
                                </a>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
