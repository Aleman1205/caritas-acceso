export interface Parada {
	Id?: number;
	Nombre: string;
    Descripcion?: string | null;
	Ubicacion: string;
    Estatus: boolean;
}

export const defaultParada: Parada = {
	Nombre: "",
    Descripcion: null,
	Ubicacion: "",
    Estatus: false
};