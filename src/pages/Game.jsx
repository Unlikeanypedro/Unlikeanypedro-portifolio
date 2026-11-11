import { useEffect, useRef } from "react";

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
    }

    draw(c) {
        const sprite = this.currentSprite;
        const img = sprite.images[sprite.currentFrame];

        // base draw size doubled (scale = 2)
        const baseSize = 100 * this.scale; // 200

        let drawWidth = baseSize;
        let drawHeight = baseSize;

        // preserve aspect ratio so the sprite is not stretched
        if (img && img.naturalWidth && img.naturalHeight) {
            const aspectRatio = img.naturalHeight / img.naturalWidth;
            drawHeight = drawWidth * aspectRatio;
        }

        // center vertically on the collision box so it feels planted
        const drawX = this.position.x;
        const drawY = this.position.y + (this.height - drawHeight) / 2;

        sprite.draw(c, drawX, drawY, drawWidth, drawHeight, this.facingRight);
    }

    update(keys, canvasWidth, canvasHeight) {
        const onGround = this.position.y + this.height >= canvasHeight - 30;

        // --- Animation state ---
        if (!onGround) {
            this.currentSprite = this.sprites.jump;
        } else if (keys.d.pressed || keys.a.pressed) {
            this.currentSprite = this.sprites.walk;
        } else {
            this.currentSprite = this.sprites.idle;
        }

        // --- Horizontal movement ---
        if (keys.d.pressed) {
            this.velocity.x = 7;
            this.facingRight = true;
        } else if (keys.a.pressed) {
            this.velocity.x = -7;
            this.facingRight = false;
        } else {
            this.velocity.x = 0;
        }

        // --- Jump ---
        if (keys.space.pressed && onGround) {
            this.velocity.y = -18;
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

        // --- Wall collision ---
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0;
        }
        if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
            this.velocity.x = 0;
        }

        this.currentSprite.update();
    }
}

export default function Map() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const c = canvas.getContext("2d");
        canvas.width = 1024;
        canvas.height = 576;

        // --- Idle still animation (9 frames): Knight_idle_still_020000.png ... 020008.png ---
        const idlePaths = Array.from(
            { length: 9 },
            (_, i) =>
                `/src/assets/sprites/the_knight/idle_still/Knight_idle_still_020${String(i).padStart(3, "0")}.png`,
        );

        // --- Walk animation (8 frames): Knight_walk0000.png ... Knight_walk0007.png ---
        const walkPaths = Array.from(
            { length: 8 },
            (_, i) =>
                `/src/assets/sprites/the_knight/walk/Knight_walk${String(i).padStart(4, "0")}.png`,
        );

        // --- Jump animation (6 frames): Knight_jump_01.png ... Knight_jump_06.png ---
        const jumpPaths = Array.from(
            { length: 6 },
            (_, i) =>
                `/src/assets/sprites/the_knight/jump/Knight_jump_${String(i + 1).padStart(2, "0")}.png`,
        );

        let sprites = null;
        let player = null;

        const keys = {
            space: { pressed: false },
            a: { pressed: false },
            d: { pressed: false },
        };

        // Load all images first, then start the loop
        Promise.all([
            loadImages(idlePaths),
            loadImages(walkPaths),
            loadImages(jumpPaths),
        ])
            .then(([idleImgs, walkImgs, jumpImgs]) => {
                sprites = {
                    idle: new Sprite({ images: idleImgs, frameBuffer: 10 }),
                    walk: new Sprite({ images: walkImgs, frameBuffer: 6 }),
                    jump: new Sprite({
                        images: jumpImgs,
                        frameBuffer: 4,
                        loop: false,
                    }),
                };

                player = new Player({
                    position: { x: 100, y: 200 },
                    velocity: { x: 0, y: 0 },
                    gravity: 0.8,
                    sprites,
                    scale: 2, // double the size
                });
            })
            .catch((err) => {
                console.error("Sprite load error:", err);
            });

        function onKeyDown(e) {
            switch (e.key) {
                case " ":
                    keys.space.pressed = true;
                    break;
                case "a":
                    keys.a.pressed = true;
                    break;
                case "d":
                    keys.d.pressed = true;
                    break;
            }
        }

        function onKeyUp(e) {
            switch (e.key) {
                case " ":
                    keys.space.pressed = false;
                    break;
                case "a":
                    keys.a.pressed = false;
                    break;
                case "d":
                    keys.d.pressed = false;
                    break;
            }
        }

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        function draw() {
            c.fillStyle = "black";
            c.fillRect(0, 0, canvas.width, canvas.height);

            if (player) {
                player.update(keys, canvas.width, canvas.height);
                player.draw(c);
            } else {
                c.fillStyle = "white";
                c.font = "20px sans-serif";
                c.fillText("Loading sprites...", 400, 280);
            }

            window.requestAnimationFrame(draw);
        }

        draw();

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    return (
        <div className="mapa-rect" style={{ width: "100%", height: "100vh" }}>
            <canvas
                ref={canvasRef}
                width={1024}
                height={576}
                style={{
                    border: "2px solid white",
                    display: "block",
                    margin: "0 auto",
                    background: "#111",
                }}
            />
        </div>
    );
}
