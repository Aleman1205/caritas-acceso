export interface SedeServicio {
    Id?: number;
    Descripcion: string
    Capacidad: number | null
    Precio: number | null
    HoraInicio: string | null
    HoraFinal?: string | null
    Estatus?: boolean | null
    IdSede?: number
    IdServicio?: number
}

export const defaultSedeServicio: SedeServicio = {
    Descripcion: "",
    Capacidad: null,
    Precio: null,
    HoraInicio: null,
    HoraFinal: null,
    Estatus: null
};