export interface SedeServicio {
    IdSede?: number
    IdServicio?: number
    Descripcion: string
    Capacidad: number | null
    Precio: number | null
    HoraInicio: string | null
    HoraFinal?: string | null
}

export const defaultSedeServicio: SedeServicio = {
    Descripcion: "",
    Capacidad: null,
    Precio: null,
    HoraInicio: null,
    HoraFinal: null
};