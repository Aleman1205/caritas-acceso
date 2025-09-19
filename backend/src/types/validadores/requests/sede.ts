import type { SedeRequest } from "../../requests/Sede.js";
import type { Request } from "express";

function isPositiveInt(x: unknown): x is number {
  return typeof x === "number" && Number.isInteger(x) && x >= 0;
}

function isIntStringValid(id: string): boolean {
  const n = Number(id);
  return Number.isInteger(n) && n >= 0;
}

export function isSedeBody(obj: Request["body"]): obj is SedeRequest["body"] {
  return (
    (obj?.Id === undefined || typeof obj?.Id === "number") &&
    (obj?.Nombre === undefined || typeof obj?.Nombre === "string") &&
    (obj?.Ubicacion === undefined || typeof obj?.Ubicacion === "string") &&
    (obj?.Ciudad === undefined || typeof obj?.Ciudad === "string") &&
    (obj?.HoraInicio === undefined || typeof obj?.HoraInicio === "string") &&
    (obj?.HoraFinal === undefined || typeof obj?.HoraFinal === "string") &&
    (obj?.Descripcion === undefined || typeof obj?.Descripcion === "string" || obj?.Descripcion === null) &&
    (
      obj?.Ids === undefined ||
      (Array.isArray(obj.Ids) && obj.Ids.every((id: unknown) => isPositiveInt(id)))
    )
  );
}

export function isSedeQuery(obj: Request["query"]): obj is SedeRequest["query"] {
  return (
    (obj?.Id === undefined || (typeof obj?.Id === "string" && isIntStringValid(obj.Id))) &&
    (obj?.Nombre === undefined || typeof obj?.Nombre === "string") &&
    (obj?.Ubicacion === undefined || typeof obj?.Ubicacion === "string") &&
    (obj?.Ciudad === undefined || typeof obj?.Ciudad === "string") &&
    (obj?.HoraInicio === undefined || typeof obj?.HoraInicio === "string") &&
    (obj?.HoraFinal === undefined || typeof obj?.HoraFinal === "string") &&
    (obj?.Descripcion === undefined || typeof obj?.Descripcion === "string")
  );
}

export function isSedeParam(obj: Request["params"]): obj is SedeRequest["params"] {
  return obj?.id !== undefined && typeof obj.id === "string" && isIntStringValid(obj.id);
}

export function isSedeBodyIds(obj: Request["body"]): boolean {
  return (
    obj?.Ids !== undefined &&
    Array.isArray(obj.Ids) &&
    obj.Ids.every((id: unknown) => isPositiveInt(id))
  );
}