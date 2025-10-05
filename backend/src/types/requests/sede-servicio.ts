import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { Request } from "express";

export interface Params extends ParamsDictionary {
    Id?: string;
}
export interface Body {
    Id?: number;
    Descripcion?: string
    Capacidad?: number
    Precio?: number
    HoraInicio: string
    HoraFinal?: string
    Estatus?: boolean | 0 | 1
    IdSede?: number
    IdServicio?: number
    Ids?: number[]; // para soportar delete
}
export interface Query extends ParsedQs {
    Id?: string;
    Descripcion?: string;
    Capacidad?: string;
    Precio?: string;
    HoraInicio?: string;
    HoraFinal?: string;
    Estatus?: string; // "true"/"false"
    IdSede?: string;
    IdServicio?: string;
}

export type SedeServicioRequest = Request<Params, {}, Body, Query>;