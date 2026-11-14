/**
 * Desenha chão e blocos no canvas. O fundo é o CSS atrás do canvas, por isso
 * o canvas é limpo (e não preenchido) a cada quadro.
 */
export function drawWorld(c, level, cameraX, viewportWidth) {
    const { floorY, platforms, height } = level;

    // Escurece a base para o ghost "assentar" no chão.
    const floorGlow = c.createLinearGradient(0, floorY - 90, 0, height);
    floorGlow.addColorStop(0, "rgba(4, 5, 9, 0)");
    floorGlow.addColorStop(1, "rgba(4, 5, 9, 0.82)");
    c.fillStyle = floorGlow;
    c.fillRect(0, floorY - 90, viewportWidth, height - (floorY - 90));

    c.strokeStyle = "rgba(195, 209, 234, 0.32)";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(0, floorY + 0.5);
    c.lineTo(viewportWidth, floorY + 0.5);
    c.stroke();

    for (const platform of platforms) {
        const x = platform.x - cameraX;
        if (x + platform.width < -60 || x > viewportWidth + 60) continue;

        c.fillStyle = "rgba(9, 14, 24, 0.92)";
        c.fillRect(x, platform.y, platform.width, platform.height);

        // Topo iluminado pelo brilho do cenário.
        c.save();
        c.shadowColor = "rgba(180, 205, 245, 0.5)";
        c.shadowBlur = 14;
        c.strokeStyle = "rgba(214, 230, 255, 0.72)";
        c.beginPath();
        c.moveTo(x + 1, platform.y + 0.5);
        c.lineTo(x + platform.width - 1, platform.y + 0.5);
        c.stroke();
        c.restore();

        c.strokeStyle = "rgba(195, 209, 234, 0.12)";
        c.strokeRect(
            x + 0.5,
            platform.y + 4.5,
            platform.width - 1,
            platform.height - 6,
        );
    }
}
