// Quantidade de páginas que aparecem no fundo enquanto o ghost caminha.
export const ZONE_COUNT = 4;

// Cada trecho do mundo tem blocos em alturas alcançáveis a partir do chão e
// uns dos outros (pulo ≈ 200px, distância horizontal ≈ 310px).
const BLOCKS = [
    { offset: 0.12, rise: 150, width: 150 },
    { offset: 0.34, rise: 290, width: 130 },
    { offset: 0.56, rise: 175, width: 170 },
    { offset: 0.78, rise: 120, width: 140 },
];

export const SPAWN_X = 90;

/**
 * Monta o mundo a partir do tamanho atual da tela.
 * O mundo tem quatro "salas" de uma tela cada: uma por página.
 */
export function buildLevel(viewportWidth, viewportHeight) {
    const worldWidth = Math.max(viewportWidth * ZONE_COUNT, 2400);
    const zoneWidth = worldWidth / ZONE_COUNT;
    const floorY = viewportHeight - 30;

    const platforms = [];
    for (let zone = 0; zone < ZONE_COUNT; zone++) {
        const zoneStart = zone * zoneWidth;
        for (const block of BLOCKS) {
            platforms.push({
                x: zoneStart + zoneWidth * block.offset,
                y: floorY - block.rise,
                width: block.width,
                height: 24,
                // Cada bloco abre a página da sua sala quando o ghost pisa nele.
                zone,
            });
        }
    }

    return { worldWidth, zoneWidth, floorY, height: viewportHeight, platforms };
}
