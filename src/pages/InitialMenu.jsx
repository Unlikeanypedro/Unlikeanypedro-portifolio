import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import bgImage from "../assets/videos/bg/1794367472683.jpg";
import Ornament from "../components/Ornament.jsx";

export default function InitialMenu() {
    const { lang, t } = useLanguage();

    const items =
        lang === "pt"
            ? [
                  { label: "sobre", to: "/sobre" },
                  { label: "projetos", to: "/projetos" },
                  { label: "experiência", to: "/experiencias" },
                  { label: "contato", to: "/contato" },
              ]
            : [
                  { label: "about", to: "/sobre" },
                  { label: "projects", to: "/projetos" },
                  { label: "experience", to: "/experiencias" },
                  { label: "contact", to: "/contato" },
              ];

    return (
        <div className="initial-menu">
            <div
                className="initial-menu__bg"
                style={{ backgroundImage: `url(${bgImage})` }}
                aria-hidden="true"
            />
            <div className="initial-menu__veil" aria-hidden="true" />

            <div className="menu-content">
                <section className="menu-title-card" aria-label="Portfólio">
                    <span className="menu-title-card__eyebrow">
                        {lang === "pt" ? "Portfólio" : "Portfolio"}
                    </span>
                    <h1>Pedro Oliveira</h1>
                    <Ornament className="menu-title-card__ornament" />
                    <p className="menu-title-card__role">{t.about.role}</p>
                </section>

                <nav className="menu-nav-card" aria-label="Navegação principal">
                    {items.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className="menu-item"
                        >
                            <span className="menu-item__bullet">✦</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <span className="menu-version">Portfólio · 2026</span>
            <span className="menu-credit">pedro oliveira</span>
        </div>
    );
}
