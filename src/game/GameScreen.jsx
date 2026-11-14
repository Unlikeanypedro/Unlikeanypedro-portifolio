import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import bgImage from "../assets/videos/bg/1794367472683.jpg";
import Ornament from "../components/Ornament.jsx";
import Inventory from "./Inventory.jsx";
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

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function GameScreen() {
    const { lang, t } = useLanguage();

    const canvasRef = useRef(null);
    const worldRef = useRef(null);
    const inventoryOpenRef = useRef(false);

    const [worldWidth, setWorldWidth] = useState(2400);
    const [activeZone, setActiveZone] = useState(0);
    const [inventoryOpen, setInventoryOpen] = useState(false);
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

    // "I" abre e fecha o inventário de projetos.
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }
            if (event.key === "i" || event.key === "I") {
                event.preventDefault();
                setInventoryOpen((open) => !open);
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
                cameraX = clamp(
                    cameraX,
                    0,
                    level.worldWidth - canvas.width,
                );
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
                    position: {
                        x: SPAWN_X,
                        y: level.floorY - 100,
                    },
                    velocity: { x: 0, y: 0 },
                    gravity: 0.8,
                    sprites,
                    scale: 2,
                });

                cameraX = clamp(
                    player.position.x +
                        player.width / 2 -
                        canvas.width / 2,
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

        // O clique continua sendo o ataque do ghost (funcionalidade anterior).
        const onMouseDown = (event) => {
            if (
                event.button === 0 &&
                player &&
                !inventoryOpenRef.current
            ) {
                player.startAttack();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("mousedown", onMouseDown);

        const draw = () => {
            c.clearRect(0, 0, canvas.width, canvas.height);

            if (player && level) {
                // Inventário aberto = jogo pausado.
                if (!inventoryOpenRef.current) {
                    player.update(keys, level);
                }

                const targetCamera = clamp(
                    player.position.x +
                        player.width / 2 -
                        canvas.width / 2,
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

                drawWorld(c, level, cameraX, canvas.width);
                player.draw(c, cameraX);

                const zone = clamp(
                    Math.floor(
                        (cameraX + canvas.width / 2) / level.zoneWidth,
                    ),
                    0,
                    ZONE_COUNT - 1,
                );
                setActiveZone((current) =>
                    current === zone ? current : zone,
                );
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
                        className={`game-zone ${activeZone === i ? "is-active" : ""}`}
                        style={{ left: `${((i + 0.5) * 100) / ZONE_COUNT}%` }}
                        aria-hidden={activeZone !== i}
                    >
                        <span className="game-zone__kicker">
                            {zone.kicker}
                        </span>
                        <h2 className="game-zone__title">{zone.title}</h2>
                        <Ornament className="game-zone__ornament" />
                        <p className="game-zone__note">{zone.note}</p>
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

            <div className="game-hud">
                <span>
                    <kbd>←</kbd>
                    <kbd>→</kbd> {lang === "pt" ? "mover" : "move"}
                </span>
                <span>
                    <kbd>espaço</kbd> {lang === "pt" ? "pular" : "jump"}
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
        </div>
    );
}
