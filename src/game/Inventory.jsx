import { useEffect, useMemo, useState } from "react";
import { useGithubProjects } from "../context/LanguageContext.jsx";
import Ornament from "../components/Ornament.jsx";
import { projects } from "../data/projects.js";
import { initialsOf } from "../utils/text.js";

/**
 * Inventário de projetos (tecla "I"): grade de itens à esquerda e detalhes
 * do item selecionado à direita.
 */
export default function Inventory({ open, onClose, lang, t }) {
    const githubProjects = useGithubProjects();
    const [selected, setSelected] = useState(0);

    const items = useMemo(
        () => [
            ...projects.map((project) => ({ ...project, source: "local" })),
            ...githubProjects.map((project) => ({ ...project, source: "gh" })),
        ],
        [githubProjects],
    );

    const count = items.length;
    const index = count ? Math.min(selected, count - 1) : 0;
    const item = items[index];

    const labels = {
        title: lang === "pt" ? "Inventário" : "Inventory",
        empty: lang === "pt" ? "Nada registrado" : "Nothing recorded",
        close: lang === "pt" ? "Fechar inventário" : "Close inventory",
        nav: lang === "pt" ? "navegar" : "navigate",
        open: lang === "pt" ? "abrir link" : "open link",
        exit: lang === "pt" ? "fechar" : "close",
    };

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                if (!count) return;
                setSelected((current) => (current + 1) % count);
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                if (!count) return;
                setSelected((current) => (current - 1 + count) % count);
            } else if (event.key === "Enter") {
                const repo = items[index]?.repo;
                if (!repo) return;
                event.preventDefault();
                window.open(repo, "_blank", "noopener");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, count, index, items, onClose]);

    if (!open) return null;

    return (
        <div
            className="inventory"
            role="dialog"
            aria-modal="true"
            aria-label={labels.title}
        >
            <div className="inventory__panel">
                <header className="inventory__head">
                    <span className="inventory__label">{labels.title}</span>
                    <span className="inventory__count">
                        {count ? `${index + 1} / ${count}` : "0 / 0"}
                    </span>
                    <button
                        type="button"
                        className="inventory__close"
                        onClick={onClose}
                        aria-label={labels.close}
                    >
                        ✕
                    </button>
                </header>

                <Ornament />

                <div className="inventory__body">
                    <div className="inventory__grid">
                        {items.map((entry, i) => {
                            const name = entry.name?.[lang] || "";
                            return (
                                <button
                                    key={`${entry.source}-${entry.id}-${i}`}
                                    type="button"
                                    className={`inventory__slot ${i === index ? "is-selected" : ""}`}
                                    onClick={() => setSelected(i)}
                                    aria-current={i === index}
                                    aria-label={name}
                                    title={name}
                                >
                                    {entry.image ? (
                                        <img
                                            src={entry.image}
                                            alt=""
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span className="inventory__initials">
                                            {initialsOf(name) || "?"}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <aside className="inventory__detail">
                        {item ? (
                            <>
                                <h2>{item.name?.[lang] || labels.empty}</h2>
                                <span className="inventory__date">
                                    {item.date}
                                </span>
                                <p className="inventory__text">
                                    {item.description?.[lang] || "—"}
                                </p>
                                {item.techs?.length > 0 && (
                                    <p className="project__techs">
                                        <strong>{t.projects.techs}: </strong>
                                        {item.techs.join(" · ")}
                                    </p>
                                )}
                                {item.repo && (
                                    <a
                                        className="btn btn--ghost journal__repo"
                                        href={item.repo}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {t.projects.repo}
                                    </a>
                                )}
                            </>
                        ) : (
                            <p className="inventory__text">{labels.empty}</p>
                        )}
                    </aside>
                </div>

                <footer className="inventory__foot">
                    <span>
                        <kbd>←</kbd>
                        <kbd>→</kbd> {labels.nav}
                    </span>
                    <span>
                        <kbd>enter</kbd> {labels.open}
                    </span>
                    <span>
                        <kbd>i</kbd>/<kbd>esc</kbd> {labels.exit}
                    </span>
                </footer>
            </div>
        </div>
    );
}
