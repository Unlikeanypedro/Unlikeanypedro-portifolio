import { Link, NavLink, Outlet } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import bgImage from "../assets/videos/bg/1794367472683.jpg";
import Ornament from "./Ornament.jsx";

const YEAR = new Date().getFullYear();

export default function Layout() {
    const { lang, setLang, t } = useLanguage();

    const links = [
        { to: "/sobre", label: t.nav.about },
        { to: "/projetos", label: t.nav.projects },
        { to: "/experiencias", label: t.nav.experiences },
        { to: "/contato", label: t.nav.contact },
    ];

    return (
        <div className="site">
            <div
                className="site__bg"
                style={{ backgroundImage: `url(${bgImage})` }}
                aria-hidden="true"
            />
            <div className="site__veil" aria-hidden="true" />

            <header className="site-header">
                <Link to="/" className="brand">
                    <span className="brand__mark">✦</span>
                    <span className="brand__name">Pedro Oliveira</span>
                </Link>

                <nav className="site-nav" aria-label="Navegação principal">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                isActive
                                    ? "site-nav__link is-active"
                                    : "site-nav__link"
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <button
                    type="button"
                    className="lang-toggle"
                    onClick={() => setLang(lang === "pt" ? "en" : "pt")}
                    aria-label="Alternar idioma / Switch language"
                >
                    {lang === "pt" ? "EN" : "PT"}
                </button>
            </header>

            <main className="site-main">
                <Outlet />
            </main>

            <footer className="site-footer">
                <Ornament className="site-footer__ornament" />
                <p>
                    © {YEAR} Pedro Oliveira — {t.footer}
                </p>
            </footer>
        </div>
    );
}
