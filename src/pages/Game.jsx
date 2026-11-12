import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/**
 * Sprite class — handles frame-based animation from an array of images.
 */
class Sprite {
    constructor({ images, frameRate = 1, frameBuffer = 5, loop = true }) {
        this.images = images;
        this.frameRate = frameRate;
        this.frameBuffer = frameBuffer;
        this.loop = loop;
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.finished = false;
    }

    update() {
        this.elapsedFrames++;
        if (this.elapsedFrames % this.frameBuffer !== 0) return;

        if (this.currentFrame < this.images.length - 1) {
            this.currentFrame++;
        } else {
            if (this.loop) {
                this.currentFrame = 0;
            } else {
                this.finished = true;
            }
        }
    }

    draw(c, x, y, width, height, flip = false) {
        const img = this.images[this.currentFrame];
        if (!img || !img.complete || !img.naturalWidth) {
            c.fillStyle = flip ? "#ff00ff" : "#00ff00";
            c.fillRect(x, y, width, height);
            return;
        }

        if (flip) {
            c.save();
            c.translate(x + width, y);
            c.scale(-1, 1);
            c.drawImage(img, 0, 0, width, height);
            c.restore();
        } else {
            c.drawImage(img, x, y, width, height);
        }
    }
}

/**
 * Loads an array of image paths and returns a Promise that resolves when all are ready.
 */
const loadImages = async (paths) => {
    const imgs = await Promise.all(
        paths.map((path) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () =>
                    reject(new Error(`Failed to load: ${path}`));
                img.src = path;
            });
        }),
    );
    return imgs;
};

// Sprites e cenário passam pelo bundler: em produção os arquivos são publicados
// com hash em /assets/, então caminhos fixos "/src/..." dariam 404.
const idleSprites = import.meta.glob(
    "../assets/sprites/the_knight/idle_still/*.png",
    { eager: true, query: "?url", import: "default" },
);
const walkSprites = import.meta.glob("../assets/sprites/the_knight/walk/*.png", {
    eager: true,
    query: "?url",
    import: "default",
});
const jumpSprites = import.meta.glob("../assets/sprites/the_knight/jump/*.png", {
    eager: true,
    query: "?url",
    import: "default",
});
const attackSprites = import.meta.glob(
    "../assets/sprites/the_knight/slash_left_longer/*.png",
    { eager: true, query: "?url", import: "default" },
);
const backgroundImages = import.meta.glob("../assets/images/bg-game/*", {
    eager: true,
    query: "?url",
    import: "default",
});

// Ordena pelos nomes (todos os frames são numerados com zero à esquerda).
const spriteUrls = (modules) =>
    Object.keys(modules)
        .sort()
        .map((key) => modules[key]);

class Player {
    constructor({ position, velocity, gravity, sprites, scale = 1 }) {
        this.position = position;
        this.velocity = velocity;
        this.gravity = gravity;
        this.sprites = sprites;
        this.currentSprite = sprites.idle;
        this.scale = scale;
        // collision box (kept square for physics)
        this.width = 100;
        this.height = 100;
        this.facingRight = true;
        this.isAttacking = false;
    }

    draw(c, cameraX = 0) {
        const sprite = this.currentSprite;
        const img = sprite.images[sprite.currentFrame];

        // base draw size 2x (scale = 2 -> 200px)
        const baseSize = 100 * this.scale; // 200

        let drawWidth = baseSize;
        let drawHeight = baseSize;

        // preserve aspect ratio so the sprite is not stretched
        if (img && img.naturalWidth && img.naturalHeight) {
            const aspectRatio = img.naturalHeight / img.naturalWidth;
            drawHeight = drawWidth * aspectRatio;
        }

        // center vertically on the collision box so it feels planted
        const drawX = this.position.x - cameraX;
        const drawY = this.position.y + (this.height - drawHeight) / 2;

        sprite.draw(c, drawX, drawY, drawWidth, drawHeight, this.facingRight);
    }

    update(keys, worldWidth, canvasHeight) {
        const onGround = this.position.y + this.height >= canvasHeight - 30;
        const goRight = keys.d.pressed || keys.right.pressed;
        const goLeft = keys.a.pressed || keys.left.pressed;
        const jump = keys.space.pressed || keys.up.pressed;

        // --- Attack takes absolute priority ---
        if (this.isAttacking) {
            this.currentSprite = this.sprites.attack;

            // lock all horizontal movement during attack
            this.velocity.x = 0;

            // check if attack animation finished
            if (this.currentSprite.finished) {
                this.isAttacking = false;
                this.currentSprite.finished = false;
                this.currentSprite.currentFrame = 0;
            }
        } else {
            // --- Animation state (only when not attacking) ---
            if (!onGround) {
                // in air -> jump animation
                this.currentSprite = this.sprites.jump;
            } else if (goRight || goLeft) {
                // moving on ground -> walk animation
                this.currentSprite = this.sprites.walk;
            } else {
                // standing still -> idle animation
                this.currentSprite = this.sprites.idle;
            }

            // --- Horizontal movement ---
            if (goRight) {
                this.velocity.x = 7;
                this.facingRight = true;
            } else if (goLeft) {
                this.velocity.x = -7;
                this.facingRight = false;
            } else {
                this.velocity.x = 0;
            }

            // --- Jump ---
            if (jump && onGround) {
                this.velocity.y = -18;
            }
        }

        // --- Physics ---
        this.velocity.y += this.gravity;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // --- Floor collision ---
        if (this.position.y + this.height > canvasHeight - 30) {
            this.position.y = canvasHeight - 30 - this.height;
            this.velocity.y = 0;
        }

        // --- World bounds (o mapa é mais largo que a tela) ---
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0;
        }
        if (this.position.x + this.width > worldWidth) {
            this.position.x = worldWidth - this.width;
            this.velocity.x = 0;
        }

        // --- Advance animation frame ---
        this.currentSprite.update();
    }

    startAttack() {
        if (this.isAttacking) return;
        this.isAttacking = true;
        this.currentSprite = this.sprites.attack;
        this.currentSprite.currentFrame = 0;
        this.currentSprite.finished = false;
        this.currentSprite.elapsedFrames = 0;
    }
}

export default function Map() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const c = canvas.getContext("2d");

        let loadError = false;
        let sprites = null;
        let player = null;

        // Cenário: as duas imagens alternadas em sequência, cada uma com a
        // altura da tela, formando um mapa contínuo maior que a viewport.
        let bgImages = [];
        let tiles = [];
        let worldWidth = 0;
        let cameraX = 0;

        const keys = {
            space: { pressed: false },
            up: { pressed: false },
            a: { pressed: false },
            d: { pressed: false },
            left: { pressed: false },
            right: { pressed: false },
        };

        // Monta o mapa: repete as imagens até cobrir 3x a largura da tela,
        // garantindo espaço para a câmera acompanhar o ghost.
        const buildWorld = () => {
            if (!bgImages.length) return;

            tiles = [];
            let x = 0;
            let i = 0;
            const targetWidth = Math.max(canvas.width * 3, canvas.width + 1);

            while (x < targetWidth) {
                const img = bgImages[i % bgImages.length];
                const width = canvas.height * (img.naturalWidth / img.naturalHeight);
                tiles.push({ img, x, width });
                x += width;
                i++;
            }

            worldWidth = x;
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleResize = () => {
            resizeCanvas();
            buildWorld();
            if (player) {
                player.position.x = Math.max(
                    0,
                    Math.min(player.position.x, worldWidth - player.width),
                );
                cameraX = Math.max(
                    0,
                    Math.min(cameraX, worldWidth - canvas.width),
                );
            }
        };

        resizeCanvas();
        window.addEventListener("resize", handleResize);

        // --- Frames de cada animação (resolvidos pelo bundler) ---
        const idlePaths = spriteUrls(idleSprites);
        const walkPaths = spriteUrls(walkSprites);
        const jumpPaths = spriteUrls(jumpSprites);
        const attackPaths = spriteUrls(attackSprites);
        const bgPaths = spriteUrls(backgroundImages);

        // Load all images first, then start the loop
        Promise.all([
            loadImages(idlePaths),
            loadImages(walkPaths),
            loadImages(jumpPaths),
            loadImages(attackPaths),
            loadImages(bgPaths),
        ])
            .then(([idleImgs, walkImgs, jumpImgs, attackImgs, bgImgs]) => {
                sprites = {
                    idle: new Sprite({ images: idleImgs, frameBuffer: 10 }),
                    walk: new Sprite({ images: walkImgs, frameBuffer: 6 }),
                    jump: new Sprite({
                        images: jumpImgs,
                        frameBuffer: 4,
                        loop: false,
                    }),
                    attack: new Sprite({
                        images: attackImgs,
                        frameBuffer: 3,
                        loop: false,
                    }),
                };

                bgImages = bgImgs;
                buildWorld();

                player = new Player({
                    position: { x: 100, y: 200 },
                    velocity: { x: 0, y: 0 },
                    gravity: 0.8,
                    sprites,
                    scale: 2, // 2x size
                });

                // Começa com a câmera já enquadrada no ghost.
                cameraX = Math.max(
                    0,
                    Math.min(
                        player.position.x +
                            player.width / 2 -
                            canvas.width / 2,
                        worldWidth - canvas.width,
                    ),
                );
            })
            .catch((err) => {
                console.error("Sprite load error:", err);
                loadError = true;
            });

        function onKeyDown(e) {
            switch (e.key) {
                case " ":
                case "ArrowUp":
                    e.preventDefault();
                    keys.space.pressed = true;
                    keys.up.pressed = true;
                    break;
                case "a":
                case "ArrowLeft":
                    e.preventDefault();
                    keys.a.pressed = true;
                    keys.left.pressed = true;
                    break;
                case "d":
                case "ArrowRight":
                    e.preventDefault();
                    keys.d.pressed = true;
                    keys.right.pressed = true;
                    break;
            }
        }

        function onKeyUp(e) {
            switch (e.key) {
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
        }

        function onMouseDown(e) {
            // left mouse button only
            if (e.button === 0 && player) {
                player.startAttack();
            }
        }

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("mousedown", onMouseDown);

        function draw() {
            c.fillStyle = "#07090f";
            c.fillRect(0, 0, canvas.width, canvas.height);

            if (player) {
                player.update(keys, worldWidth, canvas.height);

                // Câmera segue o ghost e fica presa aos limites do mapa.
                const targetCamera = Math.max(
                    0,
                    Math.min(
                        player.position.x +
                            player.width / 2 -
                            canvas.width / 2,
                        worldWidth - canvas.width,
                    ),
                );
                cameraX += (targetCamera - cameraX) * 0.15;
                if (Math.abs(targetCamera - cameraX) < 0.5) {
                    cameraX = targetCamera;
                }

                // Fundo rolável (o mapa passa enquanto o ghost anda).
                for (const tile of tiles) {
                    const screenX = tile.x - cameraX;
                    if (screenX > canvas.width || screenX + tile.width < 0) {
                        continue;
                    }
                    c.drawImage(
                        tile.img,
                        screenX,
                        0,
                        tile.width,
                        canvas.height,
                    );
                }

                player.draw(c, cameraX);
            } else {
                c.fillStyle = "white";
                c.font = "20px sans-serif";
                c.textAlign = "center";
                c.fillText(
                    loadError
                        ? "Falha ao carregar sprites"
                        : "Loading sprites...",
                    canvas.width / 2,
                    canvas.height / 2,
                );
            }

            window.requestAnimationFrame(draw);
        }

        draw();

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="mapa-rect">
            <canvas ref={canvasRef} className="mapa-canvas" />
            <Link to="/" className="game-back" aria-label="Voltar ao início">
                ← início
            </Link>
        </div>
    );
}
