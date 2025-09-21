import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { Request } from "express";

export interface Params extends ParamsDictionary {
    IdSede? : string;
    IdServicio?: string;
}
export interface Body {
    IdSede?: number
    IdServicio?: number
    Descripcion?: string
    Capacidad?: number
    Precio?: number
    HoraInicio: string
    HoraFinal?: string
    Ids?: [number, number]; // para soportar delete
}
export interface Query extends ParsedQs {
    IdSede?: string
    IdServicio?: string
    Descripcion?: string
    Capacidad?: string
    Precio?: string
    HoraInicio: string
    HoraFinal?: string
}

export type SedeServicioRequest = Request<Params, {}, Body, Query>;