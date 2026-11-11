import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import bgImage from "../assets/videos/bg/1794367472683.jpg";
import Ornament from "../components/Ornament.jsx";
import Intro, { readIntroSeen } from "../components/Intro.jsx";

// Posições aproximadas das borboletas brancas na arte de fundo (em %).
// d = atraso da animação, para que pisquem em tempos diferentes.
const BUTTERFLIES = [
    { x: 22, y: 20, d: 0 },
    { x: 19, y: 28, d: 1.2 },
    { x: 27, y: 14, d: 2.1 },
    { x: 31, y: 23, d: 0.6 },
    { x: 17, y: 40, d: 1.8 },
    { x: 76, y: 32, d: 2.6 },
];

function Butterfly() {
    return (
        <svg viewBox="0 0 24 20" aria-hidden="true">
            <ellipse cx="7" cy="7" rx="5" ry="6" />
            <ellipse cx="17" cy="7" rx="5" ry="6" />
            <ellipse cx="9" cy="14" rx="3.4" ry="4" />
            <ellipse cx="15" cy="14" rx="3.4" ry="4" />
            <rect x="11.4" y="4" width="1.2" height="13" rx="0.6" />
        </svg>
    );
}

// Mapeamento de rótulos para cada item do menu (PT / EN)
const menuLabels = {
    pt: ["jogar", "sobre", "projetos", "experiência", "contato"],
    en: ["play", "about", "projects", "experience", "contact"],
};

// Rotas de cada item do menu (as mesmas nos dois idiomas)
const itemTo = {
    pt: ["/mapa", "/sobre", "/projetos", "/experiencias", "/contato"],
    en: ["/mapa", "/sobre", "/projetos", "/experiencias", "/contato"],
};

// Ícones decorativos ao lado de cada item (usando SVG do Hollow Knight estilo)
const menuIcons = [
    { pt: "🐞", en: "🪲" },
    { pt: "ℹ️", en: "ℹ️" },
    { pt: "📁", en: "📁" },
    { pt: "⏳", en: "⏳" },
    { pt: "✉️", en: "✉️" },
];

export default function InitialMenu() {
    const { lang, t } = useLanguage();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [introOpen, setIntroOpen] = useState(() => !readIntroSeen());

    const finishIntro = useCallback(() => setIntroOpen(false), []);

    const items = itemTo[lang].map((to, i) => ({
        to,
        label: menuLabels[lang][i],
    }));

    useEffect(() => {
        // A introdução controla o teclado enquanto estiver aberta.
        if (introOpen) return;

        const handleKeyDown = (e) => {
            switch (e.key) {
                case "ArrowDown":
                case "ArrowUp": {
                    e.preventDefault();
                    const step = 1;
                    const max = items.length - 1;
                    let next = selectedIndex;
                    if (e.key === "ArrowDown") {
                        next = Math.min(selectedIndex + step, max);
                    } else {
                        next = Math.max(selectedIndex - step, 0);
                    }
                    if (next !== selectedIndex) {
                        setSelectedIndex(next);
                    }
                    break;
                }
                case "Enter": {
                    e.preventDefault();
                    const target = items[selectedIndex].to;
                    window.location.href = target;
                    break;
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, items.length, introOpen]);

    return (
        <>
        {introOpen && <Intro onFinish={finishIntro} />}

        <div className="initial-menu">
            <div
                className="initial-menu__bg"
                style={{ backgroundImage: `url(${bgImage})` }}
                aria-hidden="true"
            />
            <div className="initial-menu__veil" aria-hidden="true" />

            <div className="menu-atmosphere" aria-hidden="true">
                <span className="glow-lamp" />
                {BUTTERFLIES.map((butterfly, i) => (
                    <span
                        key={i}
                        className="butterfly"
                        style={{
                            "--x": butterfly.x,
                            "--y": butterfly.y,
                            "--d": butterfly.d,
                        }}
                    >
                        <Butterfly />
                    </span>
                ))}
            </div>

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
                    {items.map((item, i) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`menu-item ${selectedIndex === i ? "is-active" : ""}`}
                            aria-current={selectedIndex === i}
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
        </>
    );
}
