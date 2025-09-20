export function isPositiveInt(x: unknown): x is number {
  return typeof x === "number" && Number.isInteger(x) && x >= 0;
}

export function isIntStringValid(id: string): boolean {
  const n = Number(id);
  return Number.isInteger(n) && n >= 0;
}