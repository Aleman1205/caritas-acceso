export function toBoolStrict(s: string): boolean | null {
    const v = s.trim().toLowerCase();
    if (v === "true") return true;
    if (v === "false") return false;
    return null; // inválido
}