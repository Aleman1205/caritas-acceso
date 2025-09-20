import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { Request } from "express";

export interface Params extends ParamsDictionary {
    Id?: string; // para convencion de express en minuscula
}
export interface Body {
    Id?: number
    Nombre?: string
    Descripcion?: string | null
    Estatus?: boolean
    Ids?: number[]; // para soportar deleteSedes
}
export interface Query extends ParsedQs {
    Id?: string
    Nombre?: string
    Descripcion?: string
    Estatus?: string
}

export type ServicioRequest = Request<Params, {}, Body, Query>;