import type { ParsedQs } from "qs";
import type { Sede } from "../../types/db/Sede.ts"

export default function mapSedeQuery(query: ParsedQs): Partial<Sede> {
    const filtros: Partial<Sede> = {};

    if (query.Id) filtros.Id = Number(query.Id);
    if (query.Ubicacion) filtros.Ubicacion = String(query.Ubicacion);
    if (query.HoraInicio) filtros.HoraInicio = String(query.HoraInicio);
    if (query.HoraFinal) filtros.HoraFinal = String(query.HoraFinal);
    if (query.Descripcion) filtros.Descripcion = String(query.Descripcion);

    return filtros;
}
