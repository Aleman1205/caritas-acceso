import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { Request } from "express";

export interface Params extends ParamsDictionary {
    IdSedeServicio? : string
}
export interface Body {
    IdSedeServicio?: number
    Rutas: { 
        Orden: number,
        Hora: string,
        IdParada: number,
    }[] // Insercion por objeto
    Ids?: [number, number] // para soportar delete
}
export interface Query extends ParsedQs {
    IdSedeServicio? : string
    Orden?: string
    Hora?: string
    IdParada?: string
}

export type RutaRequest = Request<Params, {}, Body, Query>;