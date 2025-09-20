export interface Servicio {
    Id?: number
    Nombre: string
    Descripcion?: string | null
    Estatus: boolean
}

export const defaultServicio: Servicio = {
    Nombre: "",
    Descripcion: null,
    Estatus: false
};