import type { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";

interface Params extends ParamsDictionary {
	id?: string; //para convencion de express en minuscula
}
interface Body {
	Id?: number;
	Nombre?: string;
	Ubicacion?: string;
	Ciudad?: string;
	HoraInicio?: string;
	HoraFinal?: string;
	Descripcion?: string | null;
	Ids?: number[]; // para soportar deleteSedes
}
interface Query extends ParsedQs {
	Id?: string;
	Nombre?: string;
	Ubicacion?: string;
	Ciudad?: string;
	HoraInicio?: string;
	HoraFinal?: string;
	Descripcion?: string;
}

export type SedeRequest = Request<Params, {}, Body, Query>;