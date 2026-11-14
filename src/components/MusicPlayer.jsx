import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import trackUrl from "../assets/music/leberch-rolfied-ambient-piano-615225.mp3";

const STORAGE_KEY = "portfolio:music";
const DEFAULT_VOLUME = 0.22;

// Preferências salvas no navegador: tocando/pausada e volume.
function readPrefs() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return {
            playing: parsed.playing !== false,
            volume:
                typeof parsed.volume === "number"
                    ? Math.min(Math.max(parsed.volume, 0), 1)
                    : DEFAULT_VOLUME,
        };
    } catch {
        return null;
    }
}

export default function MusicPlayer() {
    const { lang } = useLanguage();
    const audioRef = useRef(null);

    const [prefs] = useState(readPrefs);
    const [playing, setPlaying] = useState(prefs?.playing ?? true);
    const [volume, setVolume] = useState(prefs?.volume ?? DEFAULT_VOLUME);
    const [actuallyPlaying, setActuallyPlaying] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [open, setOpen] = useState(false);

    // Volume e preferências ficam salvos no localStorage.
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ playing, volume }),
            );
        } catch {
            // Modo privado sem storage: a música continua funcionando.
        }
    }, [playing, volume]);

    // Tenta tocar; navegadores só liberam áudio depois de uma interação.
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!playing) {
            audio.pause();
            return;
        }

        const attempt = audio.play();
        if (attempt?.catch) {
            attempt.catch(() => setBlocked(true));
        }
    }, [playing]);

    // Primeiro clique/tecla em qualquer lugar libera o áudio.
    useEffect(() => {
        if (!blocked) return;

        const resume = () => {
            const audio = audioRef.current;
            if (!audio || !audio.paused) return;
            audio
                .play()
                .then(() => setBlocked(false))
                .catch(() => {});
        };

        window.addEventListener("pointerdown", resume);
        window.addEventListener("keydown", resume);
        return () => {
            window.removeEventListener("pointerdown", resume);
            window.removeEventListener("keydown", resume);
        };
    }, [blocked]);

    const labels =
        lang === "pt"
            ? {
                  player: "Música de fundo",
                  openPanel: "Abrir controles da música",
                  status: actuallyPlaying ? "tocando agora" : "pausada",
                  pause: "❚❚ pausar",
                  play: "▶ tocar",
                  volume: "volume",
              }
            : {
                  player: "Background music",
                  openPanel: "Open music controls",
                  status: actuallyPlaying ? "now playing" : "paused",
                  pause: "❚❚ pause",
                  play: "▶ play",
                  volume: "volume",
              };

    return (
        <div className="music-player">
            {open && (
                <div className="music-panel" id="music-panel">
                    <span className="music-panel__status">{labels.status}</span>
                    <p className="music-panel__title">Ambient Piano</p>
                    <p className="music-panel__credit">
                        Music by{" "}
                        <a
                            href="https://pixabay.com/users/leberch-42823964/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=615225"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Nikita Kondrashev
                        </a>{" "}
                        from{" "}
                        <a
                            href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=615225"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Pixabay
                        </a>
                    </p>

                    <div className="music-panel__controls">
                        <button
                            type="button"
                            className="music-panel__toggle"
                            onClick={() => {
                                setBlocked(false);
                                setPlaying((value) => !value);
                            }}
                        >
                            {playing ? labels.pause : labels.play}
                        </button>

                        <label className="music-panel__volume">
                            <span>{labels.volume}</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(event) =>
                                    setVolume(Number(event.target.value))
                                }
                                aria-label={labels.volume}
                            />
                            <span className="music-panel__volume-value">
                                {Math.round(volume * 100)}%
                            </span>
                        </label>
                    </div>
                </div>
            )}

            <button
                type="button"
                className={`music-disc ${actuallyPlaying ? "is-playing" : ""}`}
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="music-panel"
                aria-label={open ? labels.player : labels.openPanel}
                title={labels.player}
            >
                <span className="music-disc__label" />
            </button>

            <audio
                ref={audioRef}
                src={trackUrl}
                loop
                preload="auto"
                onPlay={() => setActuallyPlaying(true)}
                onPause={() => setActuallyPlaying(false)}
            />
        </div>
    );
}
