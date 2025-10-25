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
    IdTransaccion?: string
    Total?: string;
    Fecha?: string;
    IdSede?: string;
    IdServicio?: string;
}

export type CompraRequest = Request<Params, {}, Body, Query>;
