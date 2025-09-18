import type { RowDataPacket } from "mysql2"

export default interface Sede extends RowDataPacket {
    Id?: number
    Ubicacion: string
    HoraInicio: string
    HoraFinal: string
    Descripcion?: string | null
}