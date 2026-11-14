import { useEffect } from "react";
import About from "../pages/About.jsx";
import Projects from "../pages/Projects.jsx";
import Experiences from "../pages/Experiences.jsx";
import Contact from "../pages/Contact.jsx";

const PAGES = {
    about: About,
    projects: Projects,
    experiences: Experiences,
    contact: Contact,
};

/**
 * Página do portfólio aberta como painel flutuante por cima do jogo.
 * Fecha pelo ícone ✕, pelo fundo escuro ou pela tecla Esc.
 */
export default function PagePopup({ page, onClose, lang }) {
    const Page = page ? PAGES[page] : null;

    useEffect(() => {
        if (!page) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [page, onClose]);

    if (!page || !Page) return null;

    const labels = {
        close: lang === "pt" ? "Fechar página" : "Close page",
        hint: lang === "pt" ? "fechar" : "close",
    };

    return (
        <div className="page-popup" role="dialog" aria-modal="true">
            <div
                className="page-popup__backdrop"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="page-popup__panel">
                <button
                    type="button"
                    className="page-popup__close"
                    onClick={onClose}
                    aria-label={labels.close}
                >
                    ✕
                </button>

                <div className="page-popup__scroll">
                    <Page />
                </div>

                <footer className="page-popup__foot">
                    <kbd>esc</kbd> {labels.hint}
                </footer>
            </div>
        </div>
    );
}
