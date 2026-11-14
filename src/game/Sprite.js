/**
 * Sprite — animação por quadros a partir de um array de imagens.
 */
export class Sprite {
    constructor({ images, frameRate = 1, frameBuffer = 5, loop = true }) {
        this.images = images;
        this.frameRate = frameRate;
        this.frameBuffer = frameBuffer;
        this.loop = loop;
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.finished = false;
    }

    reset() {
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.finished = false;
    }

    update() {
        this.elapsedFrames++;
        if (this.elapsedFrames % this.frameBuffer !== 0) return;

        if (this.currentFrame < this.images.length - 1) {
            this.currentFrame++;
        } else if (this.loop) {
            this.currentFrame = 0;
        } else {
            this.finished = true;
        }
    }

    draw(c, x, y, width, height, flip = false) {
        const img = this.images[this.currentFrame];
        if (!img || !img.complete || !img.naturalWidth) return;

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
