import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import Ornament from "../components/Ornament.jsx";
import { experiences } from "../data/experiences.js";

export default function Experiences() {
    const { lang, t } = useLanguage();

    // Experiências combinadas (dois arrays, mas experiências têm prioridade visual)
    const allExperiences = [...experiences];

    // Estado de navegação da linha do tempo
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fromKeyboard, setFromKeyboard] = useState(false);

    // Navegação por setas do teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case "ArrowRight":
                    e.preventDefault();
                    setCurrentIndex((i) =>
                        Math.min(i + 1, allExperiences.length - 1),
                    );
                    setFromKeyboard(true);
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    setCurrentIndex((i) => Math.max(i - 1, 0));
                    setFromKeyboard(true);
                    break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [allExperiences.length]);

    const exp = allExperiences[currentIndex];

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

            <div className="experiences">
                {/* Linha do tempo horizontal */}
                <div
                    className="timeline-horizontal"
                    style={{
                        position: "relative",
                        width: "100%",
                        overflowX: "auto",
                        scrollBehavior: "smooth",
                    }}
                >
                    <div
                        className="timeline-horizontal__track"
                        style={{
                            display: "flex",
                            gap: "2rem",
                            padding: "1rem 0",
                        }}
                    >
                        {allExperiences.map((exp, i) => (
                            <div
                                key={exp.id}
                                className={`timeline-horizontal__item ${i === currentIndex ? "is-active" : ""}`}
                                style={{
                                    minWidth: "300px",
                                    flex: "0 0 auto",
                                    transition: "transform 0.4s ease",
                                    transform: `translateX(${i * 340}px)`,
                                }}
                            >
                                <div
                                    className="timeline-horizontal__bullet"
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                        background:
                                            i === currentIndex
                                                ? "var(--accent)"
                                                : "var(--muted)",
                                        margin: "0 auto",
                                        transition: "background 0.3s ease",
                                    }}
                                />
                                <div
                                    className="timeline-horizontal__body"
                                    style={{
                                        background: "var(--panel)",
                                        border: "1px solid var(--line)",
                                        padding: "1.5rem",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <h2
                                        style={{
                                            fontFamily: "var(--font-title)",
                                            fontWeight: "400",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        {exp.organization}
                                    </h2>
                                    <p
                                        className="timeline-horizontal__role"
                                        style={{
                                            fontFamily: "var(--label)",
                                            fontSize: "0.78rem",
                                            letterSpacing: "0.14em",
                                            textTransform: "uppercase",
                                            color:
                                                i === currentIndex
                                                    ? "var(--muted)"
                                                    : "#666",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        {exp.role[lang]}
                                    </p>
                                    <p
                                        className="text"
                                        style={{
                                            color:
                                                i === currentIndex
                                                    ? "var(--ink)"
                                                    : "#777",
                                        }}
                                    >
                                        {exp.description[lang]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Setas de navegação */}
                <div
                    className="timeline-horizontal__nav"
                    style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        gap: "1rem",
                    }}
                >
                    <button
                        className="btn btn--ghost"
                        style={{
                            position: "absolute",
                            left: 0,
                            padding: "0.5rem 1rem",
                        }}
                        onClick={() =>
                            setCurrentIndex((i) => Math.max(i - 1, 0))
                        }
                    >
                        {t.contact.back}
                    </button>
                    <button
                        className="btn btn--ghost"
                        style={{
                            position: "absolute",
                            right: 0,
                            padding: "0.5rem 1rem",
                        }}
                        onClick={() =>
                            setCurrentIndex((i) =>
                                Math.min(i + 1, allExperiences.length - 1),
                            )
                        }
                    >
                        {t.contact.next}
                    </button>
                </div>
            </div>
        </div>
    );
}
