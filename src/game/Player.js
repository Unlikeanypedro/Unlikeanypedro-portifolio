const RUN_SPEED = 7;
const JUMP_VELOCITY = -18;

/**
 * Ghost controlado pelo jogador.
 *
 * Física em coordenadas de mundo: `position` é o canto superior esquerdo da
 * caixa de colisão (quadrada, 100px). A câmera é aplicada só no desenho.
 */
export class Player {
    constructor({ position, velocity, gravity, sprites, scale = 1 }) {
        this.position = position;
        this.velocity = velocity;
        this.gravity = gravity;
        this.sprites = sprites;
        this.currentSprite = sprites.idle;
        this.scale = scale;
        this.width = 100;
        this.height = 100;
        this.facingRight = true;
        this.isAttacking = false;
        this.onGround = false;
    }

    draw(c, cameraX = 0) {
        const sprite = this.currentSprite;
        const img = sprite.images[sprite.currentFrame];

        const baseSize = 100 * this.scale;
        const drawWidth = baseSize;
        let drawHeight = baseSize;

        // Mantém a proporção original do sprite.
        if (img && img.naturalWidth && img.naturalHeight) {
            drawHeight = drawWidth * (img.naturalHeight / img.naturalWidth);
        }

        const drawX = this.position.x - cameraX;
        const drawY = this.position.y + (this.height - drawHeight) / 2;

        sprite.draw(c, drawX, drawY, drawWidth, drawHeight, this.facingRight);
    }

    update(keys, world) {
        const { floorY, platforms, worldWidth } = world;
        const goRight = keys.d.pressed || keys.right.pressed;
        const goLeft = keys.a.pressed || keys.left.pressed;
        const jump = keys.space.pressed || keys.up.pressed;

        if (this.isAttacking) {
            this.currentSprite = this.sprites.attack;
            this.velocity.x = 0;
            if (this.currentSprite.finished) {
                this.isAttacking = false;
                this.currentSprite.reset();
            }
        } else {
            if (!this.onGround) {
                this.currentSprite = this.sprites.jump;
            } else if (goRight || goLeft) {
                this.currentSprite = this.sprites.walk;
            } else {
                this.currentSprite = this.sprites.idle;
            }

            if (goRight) {
                this.velocity.x = RUN_SPEED;
                this.facingRight = true;
            } else if (goLeft) {
                this.velocity.x = -RUN_SPEED;
                this.facingRight = false;
            } else {
                this.velocity.x = 0;
            }

            if (jump && this.onGround) {
                this.velocity.y = JUMP_VELOCITY;
                this.sprites.jump.reset();
                this.onGround = false;
            }
        }

        // --- Física ---
        this.velocity.y += this.gravity;
        const previousBottom = this.position.y + this.height;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // --- Limites do mundo ---
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0;
        }
        if (this.position.x + this.width > worldWidth) {
            this.position.x = worldWidth - this.width;
            this.velocity.x = 0;
        }

        this.onGround = false;

        // --- Chão ---
        if (this.position.y + this.height >= floorY) {
            this.position.y = floorY - this.height;
            this.velocity.y = 0;
            this.onGround = true;
        }

        // --- Blocos: colisão apenas por cima (plataformas atravessáveis) ---
        if (this.velocity.y >= 0) {
            for (const platform of platforms) {
                const overlapsHorizontally =
                    this.position.x + this.width > platform.x + 8 &&
                    this.position.x < platform.x + platform.width - 8;
                if (!overlapsHorizontally) continue;

                const bottom = this.position.y + this.height;
                if (
                    previousBottom <= platform.y + 0.5 &&
                    bottom >= platform.y
                ) {
                    this.position.y = platform.y - this.height;
                    this.velocity.y = 0;
                    this.onGround = true;
                }
            }
        }

        this.currentSprite.update();
    }

    startAttack() {
        if (this.isAttacking) return;
        this.isAttacking = true;
        this.currentSprite = this.sprites.attack;
        this.currentSprite.reset();
    }
}
