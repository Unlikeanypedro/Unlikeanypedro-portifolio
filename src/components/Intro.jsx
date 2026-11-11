import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import posterImage from "../assets/videos/bg/1794367472683.jpg";
import introVideo from "../assets/videos/bg/intro.mp4";

export const INTRO_SEEN_KEY = "portfolio:intro-seen";

// Lê a preferência salva (checkbox "visto").
export function readIntroSeen() {
    try {
        return localStorage.getItem(INTRO_SEEN_KEY) === "true";
    } catch {
        return false;
    }
}

export default function Intro({ onFinish }) {
    const { lang, setLang, t } = useLanguage();
    const [step, setStep] = useState(0);
    const [seen, setSeen] = useState(readIntroSeen);
    const [videoOk, setVideoOk] = useState(true);
    const [closing, setClosing] = useState(false);
    const videoRef = useRef(null);
    const closeTimer = useRef(null);

    const messages = t.intro.messages;
    const isPrompt = step === messages.length;

    // Último Enter: fade de 3s até a tela inicial aparecer por baixo.
    const startFadeOut = useCallback(() => {
        if (closing) return;
        setClosing(true);
        closeTimer.current = window.setTimeout(onFinish, 3000);
    }, [closing, onFinish]);

    useEffect(() => {
        return () => {
            if (closeTimer.current) window.clearTimeout(closeTimer.current);
        };
    }, []);

    // Garante o autoplay em loop; se nada decodificar, cai no fundo estático.
    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;

        let cancelled = false;

        const tryPlay = () => {
            if (cancelled) return;
            const attempt = el.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(() => {});
            }
        };

        tryPlay();
        el.addEventListener("canplay", tryPlay);
        el.addEventListener("loadeddata", tryPlay);
        document.addEventListener("visibilitychange", tryPlay);

        // Navegadores com política de gesto podem bloquear o autoplay:
        // tentamos de novo até o usuário interagir com a tela.
        const retry = window.setInterval(() => {
            if (el.paused) tryPlay();
        }, 600);

        const timer = window.setTimeout(() => {
            if (el.readyState < 2) setVideoOk(false);
        }, 4000);

        return () => {
            cancelled = true;
            el.removeEventListener("canplay", tryPlay);
            el.removeEventListener("loadeddata", tryPlay);
            document.removeEventListener("visibilitychange", tryPlay);
            window.clearInterval(retry);
            window.clearTimeout(timer);
        };
    }, []);

    // Primeiro clique/toque na intro também destrava a reprodução.
    const handlePointerDown = () => {
        const el = videoRef.current;
        if (!el || !el.paused) return;
        const attempt = el.play();
        if (attempt && typeof attempt.catch === "function")
            attempt.catch(() => {});
    };

    // Enter avança as mensagens; na última, faz o fade para o menu.
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            if (closing) return;
            handlePointerDown();
            if (step < messages.length - 1) {
                setStep(step + 1);
            } else {
                startFadeOut();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [step, messages.length, closing, startFadeOut]);

    const handleSeenChange = (event) => {
        const value = event.target.checked;
        setSeen(value);
        try {
            localStorage.setItem(INTRO_SEEN_KEY, String(value));
        } catch {
            /* localStorage indisponível: segue sem persistir */
        }
    };

    return (
        <div
            className={`intro ${closing ? "is-closing" : ""}`.trim()}
            role="dialog"
            aria-modal="true"
            aria-label={t.intro.label}
            onPointerDown={handlePointerDown}
        >
            <div
                className="intro__backdrop"
                style={{ backgroundImage: `url(${posterImage})` }}
                aria-hidden="true"
            />

            {videoOk && (
                <video
                    ref={videoRef}
                    className="intro__video"
                    poster={posterImage}
                    autoPlay
                    muted
                    playsInline
                    loop
                    preload="auto"
                    aria-hidden="true"
                    onError={() => setVideoOk(false)}
                >
                    <source src={introVideo} type="video/mp4" />
                    <source src="/intro.webm" type="video/webm" />
                </video>
            )}

            <div className="intro__veil" aria-hidden="true" />

            <label className="intro__seen">
                <input
                    type="checkbox"
                    checked={seen}
                    onChange={handleSeenChange}
                />
                <span>{t.intro.seen}</span>
            </label>

            <div className="intro__controls">
                <button
                    type="button"
                    className="intro__lang"
                    onClick={() => setLang(lang === "pt" ? "en" : "pt")}
                    aria-label="Alternar idioma / Switch language"
                >
                    {lang === "pt" ? "EN" : "PT"}
                </button>
                <button
                    type="button"
                    className="intro__skip"
                    onClick={onFinish}
                    aria-label={t.intro.skip}
                    title={t.intro.skip}
                >
                    ✕
                </button>
            </div>

            <div className="intro__stage" aria-live="polite">
                {!isPrompt && (
                    <p
                        key={step}
                        className={`intro__line ${step === 2 ? "intro__line--quote" : ""}`}
                    >
                        {messages[step]}
                    </p>
                )}
            </div>

            {/* O aviso de continuar fica visível em todas as telas da intro. */}
            <p className="intro__prompt">{messages[messages.length - 1]}</p>
        </div>
    );
}
