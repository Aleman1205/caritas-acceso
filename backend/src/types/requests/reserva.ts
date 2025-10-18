import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { Request } from "express";

export interface Params extends ParamsDictionary {
	IdTransaccion?: string;
}

export interface Body {
	IdTransaccion?: string;
	FechaInicio?: string | null;
	FechaSalida?: string | null;
	NumeroHombres?: number;
	NumeroMujeres?: number;
	IdSede?: number;
}

export interface Query extends ParsedQs {
	IdTransaccion?: string;
	IdSede?: string;
	FechaInicio?: string;
	FechaSalida?: string;
}

export type ReservaRequest = Request<Params, {}, Body, Query>;
