import { pool } from "../../compartido/db/pool.js";

/**
 * Consulta reservas por teléfono (con joins necesarios)
 * Retorna rows crudas de la BD.
 */
export async function fetchReservasByTelefono(telefono) {
  const query = `
    select
      r.idtransaccion,
      r.fechainicio,
      r.fechasalida,
      r.horacheckin,
      r.hombres,
      r.mujeres,
      s.nombre    as sede,
      s.ubicacion as ubicacion,
      s.ciudad    as ciudad
    from reserva r
    join beneficiario b on r.idbeneficiario = b.id
    join sede         s on r.idsede        = s.id
    where b.telefono = $1
    order by r.fechainicio desc;
  `;
  const { rows } = await pool.query(query, [telefono]);
  return rows;
}
