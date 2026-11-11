import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import Ornament from "../components/Ornament.jsx";
import fotoPerfil from "../assets/images/FotoPerfil.png";

export default function About() {
    const { lang, t } = useLanguage();
    const [selectedSection, setSelectedSection] = useState("sobre");

    // Barra de destaque que desliza entre itens do header
    const [barPosition, setBarPosition] = useState({ left: 0, width: 0 });

    useEffect(() => {
        const items = document.querySelectorAll(".about-nav__item");
        const handleClick = (e) => {
            e.preventDefault();
            const id = e.currentTarget.getAttribute("data-id");
            setSelectedSection(id);

            // Atualizar posição da barra
            const rect = e.currentTarget.getBoundingClientRect();
            setBarPosition({
                left: rect.left - 20,
                width: rect.width,
            });
        };

        items.forEach((item) => item.addEventListener("click", handleClick));
        return () => {
            items.forEach((item) => item.removeEventListener("click", handleClick));
        };
    }, [selectedSection]);

    return (
        <div className="page">
            <header className="page-head" style={{ position: "relative", padding: "0 2rem" }}>
                <span className="page-head__kicker" style={{ marginRight: "auto" }}>01 — {t.nav.about}</span>
                <h1>{t.about.title}</h1>
                <Ornament />

                <div className="about-nav" style={{ position: "absolute", top: 16, right: 2 }}>
                    <div
                        className="about-nav__bar"
                        style={{ position: "absolute", bottom: 0, height: "2px", background: "var(--accent)", transition: "left 0.3s ease, width 0.3s ease", ...barPosition }}
                    ></div>
                    <nav>
                        <a
                            className="about-nav__item about-nav__item--sobre"
                            data-id="sobre"
                            style={{ marginRight: "2rem" }}
                        >
                            <span>{t.nav.about}</span>
                        </a>
                        <a
                            className="about-nav__item about-nav__item--projetos"
                            data-id="projetos"
                        >
                            <span>{t.nav.projects}</span>
                        </a>
                        <a
                            className="about-nav__item about-nav__item--experiencias"
                            data-id="experiencias"
                        >
                            <span>{t.nav.experiences}</span>
                        </a>
                        <a
                            className="about-nav__item about-nav__item--contato"
                            data-id="contato"
                        >
                            <span>{t.nav.contact}</span>
                        </a>
                    </nav>
                </div>
            </header>

            <div className="about">
                <figure className="about__portrait" style={{ textAlign: "center", margin: "0 auto" }}>
                    <img
                        src={fotoPerfil}
                        alt="Pedro Oliveira"
                        style={{ width: "180px", height: "180px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--line)", background: "var(--panel)" }}
                    />
                </figure>

                <div className="about__body">
                    <p className="about__role">{t.about.role}</p>
                    <p className="text">{t.about.text}</p>
                    <blockquote className="about__quote">
                        <span className="quote-mark">"</span>
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