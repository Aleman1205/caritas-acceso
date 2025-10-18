import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { Request } from "express";

export interface Params extends ParamsDictionary {
	Id?: string;
}
export interface Body {
	Email?: string;
	Telefono?: string;
	Nombre?: string;
	Apellido?: string;
	FotoUrl?: string; 
	FechaNacimiento?: string;
	IdTipoUsuario?: number;
	Ids?: string[]; // para soportar deleteUsuario
}
export interface Query extends ParsedQs {
	Email?: string;
  Telefono?: string;
  Nombre?: string;
	Apellido?: string;
	FotoUrl?: string; 
	FechaNacimiento?: string;
	IdTipoUsuario?: string;
}

export type SedeRequest = Request<Params, {}, Body, Query>;
