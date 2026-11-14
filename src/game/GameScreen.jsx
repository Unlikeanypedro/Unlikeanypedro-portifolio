import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import bgImage from "../assets/videos/bg/1794367472683.jpg";
import Ornament from "../components/Ornament.jsx";
import Inventory from "./Inventory.jsx";
import PagePopup from "./PagePopup.jsx";
import { loadImages, spritePaths } from "./assets.js";
import { Sprite } from "./Sprite.js";
import { Player } from "./Player.js";
import { buildLevel, SPAWN_X, ZONE_COUNT } from "./level.js";
import { drawWorld } from "./render.js";

const SPRITE_SETTINGS = {
    idle: { frameBuffer: 10 },
    walk: { frameBuffer: 6 },
    jump: { frameBuffer: 4, loop: false },
    attack: { frameBuffer: 3, loop: false },
};

// Distância horizontal (px) do centro do card da página em que o ghost já
// pode interagir.
const CARD_REACH = 140;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function GameScreen() {
    const { lang, t } = useLanguage();

    const canvasRef = useRef(null);
    const worldRef = useRef(null);
    const inventoryOpenRef = useRef(false);
    const popupOpenRef = useRef(false);
    const nearbyRef = useRef(null);

    const [worldWidth, setWorldWidth] = useState(2400);
    const [activeZone, setActiveZone] = useState(0);
    const [nearby, setNearby] = useState(null);
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [popupPage, setPopupPage] = useState(null);
    const [status, setStatus] = useState("loading");

    const zones = [
        {
            key: "about",
            kicker: `01 · ${t.nav.about}`,
            title: t.about.title,
            note: t.about.role,
        },
        {
            key: "projects",
            kicker: `02 · ${t.nav.projects}`,
            title: t.projects.title,
            note: t.projects.subtitle,
        },
        {
            key: "experiences",
            kicker: `03 · ${t.nav.experiences}`,
            title: t.experiences.title,
            note: t.experiences.subtitle,
        },
        {
            key: "contact",
            kicker: `04 · ${t.nav.contact}`,
            title: t.contact.title,
            note: t.contact.subtitle,
        },
    ];

    useEffect(() => {
        inventoryOpenRef.current = inventoryOpen;
    }, [inventoryOpen]);

    useEffect(() => {
        popupOpenRef.current = popupPage !== null;
    }, [popupPage]);

    // Teclado da tela: "I" abre o inventário, "E" abre a página próxima.
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }
            if (event.key === "i" || event.key === "I") {
                if (popupOpenRef.current) return;
                event.preventDefault();
                setInventoryOpen((open) => !open);
            } else if (event.key === "e" || event.key === "E") {
                if (
                    popupOpenRef.current ||
                    inventoryOpenRef.current ||
                    nearbyRef.current === null
                ) {
                    return;
                }
                event.preventDefault();
                setPopupPage(nearbyRef.current);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const c = canvas.getContext("2d");
        const keys = {
            space: { pressed: false },
            up: { pressed: false },
            a: { pressed: false },
            d: { pressed: false },
            left: { pressed: false },
            right: { pressed: false },
        };

        let level = null;
        let player = null;
        let cameraX = 0;
        let frame = 0;
        let disposed = false;

        // Mantém o estado do React e a ref (usada pelo loop e pelos eventos)
        // sempre iguais, sem re-renderizar a cada quadro.
        const syncNearby = (value) => {
            if (nearbyRef.current === value) return;
            nearbyRef.current = value;
            setNearby(value);
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            level = buildLevel(canvas.width, canvas.height);
            setWorldWidth(level.worldWidth);

            if (player) {
                player.position.x = clamp(
                    player.position.x,
                    0,
                    level.worldWidth - player.width,
                );
                if (player.position.y + player.height > level.floorY) {
                    player.position.y = level.floorY - player.height;
                    player.velocity.y = 0;
                }
                cameraX = clamp(cameraX, 0, level.worldWidth - canvas.width);
            }
        };

        resize();
        window.addEventListener("resize", resize);

        setStatus("loading");
        const entries = Object.entries(spritePaths);
        Promise.all(entries.map(([, paths]) => loadImages(paths)))
            .then((groups) => {
                if (disposed) return;

                const sprites = {};
                entries.forEach(([name], i) => {
                    sprites[name] = new Sprite({
                        images: groups[i],
                        ...SPRITE_SETTINGS[name],
                    });
                });

                player = new Player({
                    position: { x: SPAWN_X, y: level.floorY - 100 },
                    velocity: { x: 0, y: 0 },
                    gravity: 0.8,
                    sprites,
                    scale: 2,
                });

                cameraX = clamp(
                    player.position.x + player.width / 2 - canvas.width / 2,
                    0,
                    level.worldWidth - canvas.width,
                );
                setStatus("ready");
            })
            .catch((error) => {
                console.error("Sprite load error:", error);
                if (!disposed) setStatus("error");
            });

        const onKeyDown = (event) => {
            switch (event.key) {
                case " ":
                case "ArrowUp":
                    event.preventDefault();
                    keys.space.pressed = true;
                    keys.up.pressed = true;
                    break;
                case "a":
                case "ArrowLeft":
                    event.preventDefault();
                    keys.a.pressed = true;
                    keys.left.pressed = true;
                    break;
                case "d":
                case "ArrowRight":
                    event.preventDefault();
                    keys.d.pressed = true;
                    keys.right.pressed = true;
                    break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.key) {
                case " ":
                case "ArrowUp":
                    keys.space.pressed = false;
                    keys.up.pressed = false;
                    break;
                case "a":
                case "ArrowLeft":
                    keys.a.pressed = false;
                    keys.left.pressed = false;
                    break;
                case "d":
                case "ArrowRight":
                    keys.d.pressed = false;
                    keys.right.pressed = false;
                    break;
            }
        };

        // Perto de um card: o clique abre a página. Caso contrário, o clique
        // continua sendo o ataque do ghost.
        const onMouseDown = (event) => {
            if (event.button !== 0 || event.target !== canvas) return;
            if (inventoryOpenRef.current || popupOpenRef.current) return;

            if (nearbyRef.current !== null) {
                setPopupPage(nearbyRef.current);
                return;
            }
            if (player) player.startAttack();
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("mousedown", onMouseDown);

        const draw = () => {
            c.clearRect(0, 0, canvas.width, canvas.height);

            if (player && level) {
                // Inventário ou pop-up aberto = jogo pausado.
                const paused =
                    inventoryOpenRef.current || popupOpenRef.current;

                if (!paused) {
                    player.update(keys, level);
                }

                const targetCamera = clamp(
                    player.position.x + player.width / 2 - canvas.width / 2,
                    0,
                    level.worldWidth - canvas.width,
                );
                cameraX += (targetCamera - cameraX) * 0.15;
                if (Math.abs(targetCamera - cameraX) < 0.5) {
                    cameraX = targetCamera;
                }

                if (worldRef.current) {
                    worldRef.current.style.transform = `translate3d(${-cameraX}px, 0, 0)`;
                }

                const zone = clamp(
                    Math.floor((cameraX + canvas.width / 2) / level.zoneWidth),
                    0,
                    ZONE_COUNT - 1,
                );
                setActiveZone((current) =>
                    current === zone ? current : zone,
                );

                // Interação: em cima de um bloco ou perto do card da sala.
                const playerCenter = player.position.x + player.width / 2;
                const playerZone = clamp(
                    Math.floor(playerCenter / level.zoneWidth),
                    0,
                    ZONE_COUNT - 1,
                );

                let interact = null;
                if (player.standingOn) {
                    interact = player.standingOn.zone;
                } else if (player.onGround) {
                    const cardX = level.zoneWidth * (playerZone + 0.5);
                    if (Math.abs(playerCenter - cardX) <= CARD_REACH) {
                        interact = playerZone;
                    }
                }
                syncNearby(interact);

                drawWorld(c, level, cameraX, canvas.width, nearbyRef.current);
                player.draw(c, cameraX);
            }

            if (!disposed) frame = window.requestAnimationFrame(draw);
        };

        draw();

        return () => {
            disposed = true;
            window.cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("mousedown", onMouseDown);
        };
    }, []);

    const overlayOpen = inventoryOpen || popupPage !== null;

    return (
        <div className="game-screen">
            <div
                className="initial-menu__bg"
                style={{ backgroundImage: `url(${bgImage})` }}
                aria-hidden="true"
            />
            <div className="initial-menu__veil" aria-hidden="true" />

            {/* Páginas do portfólio no fundo, reveladas conforme o ghost anda. */}
            <div
                ref={worldRef}
                className="game-world"
                style={{ width: worldWidth }}
            >
                {zones.map((zone, i) => (
                    <section
                        key={zone.key}
                        className={[
                            "game-zone",
                            activeZone === i ? "is-active" : "",
                            nearby === i && !overlayOpen ? "is-near" : "",
                        ]
                            .join(" ")
                            .trim()}
                        style={{ left: `${((i + 0.5) * 100) / ZONE_COUNT}%` }}
                        aria-hidden={activeZone !== i}
                    >
                        <span className="game-zone__kicker">
                            {zone.kicker}
                        </span>
                        <h2 className="game-zone__title">{zone.title}</h2>
                        <Ornament className="game-zone__ornament" />
                        <p className="game-zone__note">{zone.note}</p>
                        <span className="game-zone__interact">
                            <kbd>e</kbd> {lang === "pt" ? "abrir" : "open"}
                        </span>
                    </section>
                ))}
            </div>

            <canvas ref={canvasRef} className="game-canvas" />

            {status !== "ready" && (
                <div className="game-status" aria-live="polite">
                    {status === "error"
                        ? lang === "pt"
                            ? "Falha ao carregar os sprites."
                            : "Failed to load sprites."
                        : lang === "pt"
                          ? "Carregando..."
                          : "Loading..."}
                </div>
            )}

            <Link to="/" className="game-back" aria-label="Voltar ao início">
                ← início
            </Link>

            {nearby !== null && !overlayOpen && (
                <div className="game-prompt" aria-live="polite">
                    <kbd>e</kbd>
                    <span>
                        {lang === "pt" ? "abrir" : "open"}{" "}
                        <strong>{zones[nearby].title}</strong>
                    </span>
                    <span className="game-prompt__hint">
                        {lang === "pt" ? "ou clique" : "or click"}
                    </span>
                </div>
            )}

            <div className="game-hud">
                <span>
                    <kbd>←</kbd>
                    <kbd>→</kbd> {lang === "pt" ? "mover" : "move"}
                </span>
                <span>
                    <kbd>espaço</kbd> {lang === "pt" ? "pular" : "jump"}
                </span>
                <span>
                    <kbd>e</kbd> {lang === "pt" ? "interagir" : "interact"}
                </span>
                <span>
                    <kbd>i</kbd> {lang === "pt" ? "inventário" : "inventory"}
                </span>
            </div>

            <Inventory
                open={inventoryOpen}
                onClose={() => setInventoryOpen(false)}
                lang={lang}
                t={t}
            />

            <PagePopup
                page={popupPage === null ? null : zones[popupPage].key}
                onClose={() => setPopupPage(null)}
                lang={lang}
            />
        </div>
    );
}
