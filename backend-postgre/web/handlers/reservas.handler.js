// backend-postgre/web/handlers/reservas.handler.js
import { pool } from "../../compartido/db/pool.js";

/** EXISTENTE */
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
      s.ciudad    as ciudad,
      b.telefono  as telefono
    from reserva r
    join beneficiario b on r.idbeneficiario = b.id
    join sede         s on r.idsede        = s.id
    where b.telefono = $1
    order by r.fechainicio desc;
  `;
  const { rows } = await pool.query(query, [telefono]);
  return rows;
}

/** NUEVO: todas las reservas (sin filtro por teléfono) */
export async function fetchReservasAll() {
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
      s.ciudad    as ciudad,
      b.telefono  as telefono
    from reserva r
    join beneficiario b on r.idbeneficiario = b.id
    join sede         s on r.idsede        = s.id
    order by r.fechainicio desc;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

/** Elimina una reserva por IdTransaccion en la tabla `reserva`. */
export async function deleteReservaByIdTx(idTransaccion) {
  const { rowCount } = await pool.query(
    `delete from reserva where idtransaccion = $1`,
    [idTransaccion]
  );
  return rowCount > 0;
}
