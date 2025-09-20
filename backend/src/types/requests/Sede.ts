import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { Request } from "express";

export interface Params extends ParamsDictionary {
	Id?: string; // para convencion de express en minuscula
}
export interface Body {
	Id?: number;
	Nombre?: string;
	Ubicacion?: string;
	Ciudad?: string;
	HoraInicio?: string;
	HoraFinal?: string;
	Descripcion?: string | null;
	Ids?: number[]; // para soportar deleteSedes
}
export interface Query extends ParsedQs {
	Id?: string;
	Nombre?: string;
	Ubicacion?: string;
	Ciudad?: string;
	HoraInicio?: string;
	HoraFinal?: string;
	Descripcion?: string;
}

export type SedeRequest = Request<Params, {}, Body, Query>;