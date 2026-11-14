// Iniciais de um nome, usadas nos slots sem imagem (projetos do GitHub).
export function initialsOf(name = "") {
    return name
        .replace(/[^\p{L}\p{N} ]/gu, "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}
