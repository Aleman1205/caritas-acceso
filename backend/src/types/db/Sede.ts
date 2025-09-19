import type { RowDataPacket } from "mysql2";

export interface SedeDTO {
	Id?: number;
	Nombre: string;
	Ubicacion: string;
	Ciudad: string;
	HoraInicio: string; // TIME 'HH:MM:SS'
	HoraFinal: string;  // TIME 'HH:MM:SS'
	Descripcion?: string | null;
}

export interface Sede extends SedeDTO, RowDataPacket {}

export const defaultSede: SedeDTO = {
	Nombre: "",
	Ubicacion: "",
	Ciudad: "",
	HoraInicio: "",
	HoraFinal: "",
	Descripcion: null
};