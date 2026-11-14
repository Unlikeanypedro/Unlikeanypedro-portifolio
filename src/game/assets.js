// Sprites do ghost: passam pelo bundler para funcionar também em produção
// (em /assets/ os arquivos recebem hash, então caminhos fixos dariam 404).
const idleModules = import.meta.glob(
    "../assets/sprites/the_knight/idle_still/*.png",
    { eager: true, query: "?url", import: "default" },
);
const walkModules = import.meta.glob(
    "../assets/sprites/the_knight/walk/*.png",
    { eager: true, query: "?url", import: "default" },
);
const jumpModules = import.meta.glob(
    "../assets/sprites/the_knight/jump/*.png",
    { eager: true, query: "?url", import: "default" },
);
const attackModules = import.meta.glob(
    "../assets/sprites/the_knight/slash_left_longer/*.png",
    { eager: true, query: "?url", import: "default" },
);

// Os frames são numerados com zero à esquerda, então a ordenação alfabética
// das chaves equivale à ordem da animação.
const toUrls = (modules) =>
    Object.keys(modules)
        .sort()
        .map((key) => modules[key]);

export const spritePaths = {
    idle: toUrls(idleModules),
    walk: toUrls(walkModules),
    jump: toUrls(jumpModules),
    attack: toUrls(attackModules),
};

export const loadImages = (paths) =>
    Promise.all(
        paths.map(
            (path) =>
                new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = () =>
                        reject(new Error(`Failed to load: ${path}`));
                    img.src = path;
                }),
        ),
    );
