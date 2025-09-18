import type { RowDataPacket } from "mysql2"

export interface SedeDTO {
    Id?: number
    Ubicacion: string
    HoraInicio: string
    HoraFinal: string
    Descripcion?: string | null
}

export interface Sede extends SedeDTO, RowDataPacket {}