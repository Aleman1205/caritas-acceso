import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { Request } from "express";

export interface Params extends ParamsDictionary {
    Id? : string;
}
export interface Body {
    IdTransaccion?: string;
    Total?: number;
    Fecha?: string;
    IdSede?: number;
    IdServicio?: number;
    Ids?: string[]; // para soportar delete
}
export interface Query extends ParsedQs {
    IdTransaccion?: string;
    Total?: number;
    Fecha?: string;
    IdSede?: number;
    IdServicio?: number;
}

export type ParadaRequest = Request<Params, {}, Body, Query>;
