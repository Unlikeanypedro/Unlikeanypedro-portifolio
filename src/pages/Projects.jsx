import { useEffect, useState } from "react";
import { useLanguage, useGithubProjects } from "../context/LanguageContext.jsx";
import Ornament from "../components/Ornament.jsx";
import { projects } from "../data/projects.js";

// Canto ornamental da moldura (mesmo motivo do Diário do Hollow Knight).
function CornerFlourish({ className }) {
    return (
        <svg
            className={`journal__corner ${className}`}
            viewBox="0 0 90 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M4 46V4h42" />
            <path d="M12 34c0-12 10-22 22-22" opacity="0.5" />
            <path d="M6 54c18-2 32-16 34-34" opacity="0.3" />
            <path d="M26 26l5 5-5 5-5-5z" fill="currentColor" stroke="none" />
            <circle cx="46" cy="8" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="8" cy="46" r="1.6" fill="currentColor" stroke="none" />
        </svg>
    );
}

function initialsOf(name) {
    return name
        .replace(/[^\p{L}\p{N} ]/gu, "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}

export default function Projects() {
    const { lang, t } = useLanguage();
    const githubProjects = useGithubProjects();
    const [active, setActive] = useState(0);

    const allProjects = [
        ...projects.map((project) => ({ ...project, source: "local" })),
        ...githubProjects.map((project) => ({ ...project, source: "gh" })),
    ];

    const total = allProjects.length;
    const index = Math.min(active, Math.max(total - 1, 0));
    const project = allProjects[index];

    const goTo = (next) => {
        if (!total) return;
        setActive((next + total) % total);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                goTo(index + 1);
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                goTo(index - 1);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [index, total]);

    const journalLabel = lang === "pt" ? "Diário" : "Journal";
    const nextLabel = lang === "pt" ? "Próximo" : "Next";
    const emptyLabel = lang === "pt" ? "Nada registrado" : "Nothing recorded";

    return (
        <div className="page journal-page">
            <div className="journal">
                <CornerFlourish className="journal__corner--tl" />
                <CornerFlourish className="journal__corner--tr" />
                <CornerFlourish className="journal__corner--bl" />
                <CornerFlourish className="journal__corner--br" />

                <header className="journal__head">
                    <span className="journal__label">{journalLabel}</span>
                    <span className="journal__emblems" aria-hidden="true">
                        <i>✦</i>
                        <i>❖</i>
                        <i>✧</i>
                    </span>
                    <span className="journal__count">
                        {total ? `${index + 1} / ${total}` : `0 / 0`}
                    </span>
                </header>

                <div className="journal__rule">
                    <Ornament />
                </div>

                <div className="journal__body">
                    <nav className="journal__grid" aria-label={t.projects.index}>
                        {allProjects.map((entry, i) => {
                            const name = entry.name?.[lang] || "";
                            return (
                                <button
                                    key={`${entry.source}-${entry.id}-${i}`}
                                    type="button"
                                    className={`journal__entry ${i === index ? "is-active" : ""}`}
                                    onClick={() => setActive(i)}
                                    aria-current={i === index}
                                    aria-label={name}
                                    title={name}
                                >
                                    {entry.image ? (
                                        <img src={entry.image} alt="" loading="lazy" />
                                    ) : (
                                        <span className="journal__entry-initials">
                                            {initialsOf(name) || "?"}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <figure className="journal__art">
                        {project?.image ? (
                            <img
                                src={project.image}
                                alt={project.name?.[lang] || ""}
                            />
                        ) : (
                            <span className="journal__art-initials">
                                {initialsOf(project?.name?.[lang] || "") || "?"}
                            </span>
                        )}
                    </figure>

                    <aside className="journal__detail">
                        {project ? (
                            <>
                                <h1 className="journal__title">
                                    {project.name?.[lang] || emptyLabel}
                                </h1>
                                <span className="journal__date">
                                    {project.date}
                                </span>
                                <p className="journal__text">
                                    {project.description?.[lang] || "—"}
                                </p>
                                <div className="journal__divider" />
                                {project.techs?.length > 0 && (
                                    <p className="project__techs">
                                        <strong>{t.projects.techs}: </strong>
                                        {project.techs.join(" · ")}
                                    </p>
                                )}
                                {project.repo && (
                                    <a
                                        className="btn btn--ghost journal__repo"
                                        href={project.repo}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {t.projects.repo}
                                    </a>
                                )}
                                <div className="journal__next">
                                    <button
                                        type="button"
                                        onClick={() => goTo(index + 1)}
                                    >
                                        {nextLabel} <span aria-hidden="true">→</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="journal__text">{emptyLabel}</p>
                        )}
                    </aside>
                </div>

                <div className="journal__rule journal__rule--bottom">
                    <Ornament />
                </div>
            </div>
        </div>
    );
}
