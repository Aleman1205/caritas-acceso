import type { SedeDTO } from "../types/db/Sede.js";
import type { SedeRequest } from "../types/requests/Sede.js";

export function mapQueryToSedeDTO(query: SedeRequest["query"]): Partial<SedeDTO> {
    const filtros: Partial<SedeDTO> = {};

    if (query.Id !== undefined) {
        const n = Number(query.Id);
        if (!isNaN(n)) filtros.Id = n;
    }
    if (query.Nombre) filtros.Nombre = query.Nombre;
    if (query.Ubicacion) filtros.Ubicacion = query.Ubicacion;
    if (query.Ciudad) filtros.Ciudad = query.Ciudad;
    if (query.HoraInicio) filtros.HoraInicio = query.HoraInicio;
    if (query.HoraFinal) filtros.HoraFinal = query.HoraFinal;
    if (query.Descripcion) filtros.Descripcion = query.Descripcion;

    return filtros;
}