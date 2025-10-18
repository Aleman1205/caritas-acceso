import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { Request } from "express";

export interface Params extends ParamsDictionary {
    Id? : string;
}
export interface Body {
    Id?: number
    Nombre?: string;
    Descripcion?: string
    Ubicacion?: string
    Estatus?: boolean
    Ids?: number[]; // para soportar delete
}
export interface Query extends ParsedQs {
    Id?: string
    Nombre?: string;
    Descripcion?: string
    Ubicacion?: string
    Estatus?: string
}

export type ParadaRequest = Request<Params, {}, Body, Query>;