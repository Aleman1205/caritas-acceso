export type Key = number | string | Record<string, number | string>;

export function isPrimitiveKey(k: Key): k is number | string {
  return typeof k === "number" || typeof k === "string";
}