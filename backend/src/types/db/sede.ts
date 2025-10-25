export interface Sede {
	Id?: number;
	Nombre: string;
	Ubicacion: string;
	Ciudad: string;
	HoraInicio: string; // TIME 'HH:MM:SS'
	HoraFinal: string;  // TIME 'HH:MM:SS'
	Descripcion?: string | null;
}

export const defaultSede: Sede = {
	Nombre: "",
	Ubicacion: "",
	Ciudad: "",
	HoraInicio: "",
	HoraFinal: "",
	Descripcion: null
};