// backend-postgre/web/routes/reservas.js
import express from "express";
import { pool } from "../../compartido/db/pool.js";

export const router = express.Router();

/**
 * Normaliza un row de BD al formato que usa tu frontend (ReservaTelefono)
 * + incluye 'beneficiario' y, si está disponible, 'telefono'
 */
function mapRow(r) {
  const now = new Date();
  let status = "pendiente";
  const ini = r.fechainicio ? new Date(r.fechainicio) : null;
  const fin = r.fechasalida ? new Date(r.fechasalida) : null;

  if (fin) status = "finalizada";
  else if (ini && ini <= now) status = "en_estancia";

  const beneficiario = [r.ben_nombre, r.ben_apellido].filter(Boolean).join(" ").trim();

  return {
    idTransaccion: r.idtransaccion,
    clave: r.idtransaccion?.slice(0, 12) ?? "",
    sede: r.sede,
    ubicacion: r.ubicacion,
    ciudad: r.ciudad,
    fechaInicio: r.fechainicio,
    fechaSalida: r.fechasalida,
    horaCheckIn: r.horacheckin,
    hombres: r.hombres,
    mujeres: r.mujeres,
    status,
    beneficiario,
    telefono: r.telefono ?? null,
  };
}

/* =========================== GET /web/reservas (todas) =========================== */
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        r.idtransaccion,
        r.fechainicio,
        r.fechasalida,
        r.horacheckin,
        r.hombres,
        r.mujeres,
        s.nombre    AS sede,
        s.ubicacion AS ubicacion,
        s.ciudad    AS ciudad,
        COALESCE(b.nombre, '')   AS ben_nombre,
        COALESCE(b.apellido, '') AS ben_apellido,
        b.telefono               AS telefono
      FROM reserva r
      JOIN sede s              ON r.idsede = s.id
      LEFT JOIN beneficiario b ON r.idbeneficiario = b.id
      ORDER BY r.fechainicio DESC NULLS LAST;
      `
    );

    const data = (rows || []).map(mapRow);
    return res.json({
      success: true,
      message: "Reservas obtenidas correctamente.",
      data,
    });
  } catch (err) {
    console.error("Error /web/reservas:", err);
    return res.status(500).json({
      success: false,
      message: "Error consultando reservas",
      data: [],
    });
  }
});

/* ======================= GET /web/reservas/fin (reservafin) ======================= */
router.get("/fin", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        rf.id,
        rf.idtransaccion,
        rf.fechainicio,
        rf.fechasalida,
        rf.horacheckin,
        rf.hombres,
        rf.mujeres,
        rf.idsede,
        rf.idbeneficiario,
        s.nombre    AS sede,
        s.ubicacion AS ubicacion,
        s.ciudad    AS ciudad,
        COALESCE(b.nombre, '')   AS ben_nombre,
        COALESCE(b.apellido, '') AS ben_apellido,
        b.telefono               AS telefono
      FROM reservafin rf
      LEFT JOIN sede s           ON rf.idsede = s.id
      LEFT JOIN beneficiario b   ON rf.idbeneficiario = b.id
      ORDER BY rf.fechainicio DESC NULLS LAST;
      `
    );

    const data = (rows || []).map((r) => {
      // Si en el futuro agregas columna "estado" en reservafin, úsala aquí.
      const status = r.fechasalida ? "finalizada" : "cancelada";
      const beneficiario = [r.ben_nombre, r.ben_apellido].filter(Boolean).join(" ").trim();

      return {
        idTransaccion: r.idtransaccion,
        clave: r.idtransaccion?.slice(0, 12) ?? "",
        sede: r.sede,
        ubicacion: r.ubicacion,
        ciudad: r.ciudad,
        fechaInicio: r.fechainicio,
        fechaSalida: r.fechasalida,
        horaCheckIn: r.horacheckin,
        hombres: r.hombres,
        mujeres: r.mujeres,
        status,
        beneficiario,
        telefono: r.telefono ?? null,
      };
    });

    return res.json({
      success: true,
      message: "Reservas (reservafin) obtenidas correctamente.",
      data,
    });
  } catch (err) {
    console.error("Error /web/reservas/fin:", err);
    return res.status(500).json({
      success: false,
      message: "Error consultando reservafin",
      data: [],
    });
  }
});

/* ================== GET /web/reservas/:telefono (por teléfono) =================== */
router.get("/:telefono", async (req, res) => {
  const telefono = String(req.params.telefono || "").trim();

  try {
    const { rows } = await pool.query(
      `
      SELECT
        r.idtransaccion,
        r.fechainicio,
        r.fechasalida,
        r.horacheckin,
        r.hombres,
        r.mujeres,
        s.nombre    AS sede,
        s.ubicacion AS ubicacion,
        s.ciudad    AS ciudad,
        COALESCE(b.nombre, '')   AS ben_nombre,
        COALESCE(b.apellido, '') AS ben_apellido,
        b.telefono               AS telefono
      FROM reserva r
      JOIN beneficiario b ON r.idbeneficiario = b.id
      JOIN sede s         ON r.idsede        = s.id
      WHERE b.telefono = $1
      ORDER BY r.fechainicio DESC NULLS LAST;
      `,
      [telefono]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron reservas para este teléfono.",
        data: [],
      });
    }

    const data = rows.map(mapRow);
    return res.json({
      success: true,
      message: "Reservas obtenidas correctamente.",
      data,
    });
  } catch (err) {
    console.error("Error /web/reservas/:telefono:", err);
    return res.status(500).json({
      success: false,
      message: "Error consultando reservas",
      data: [],
    });
  }
});

/* ====== DELETE /web/reservas/:idTransaccion  (mueve a reservafin y elimina) ====== */
router.delete("/:idTransaccion", async (req, res) => {
  const idTransaccion = String(req.params.idTransaccion || "").trim();
  if (!idTransaccion) {
    return res.status(400).json({
      success: false,
      message: "Falta idTransaccion.",
      data: [],
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1) Traer la reserva original
    const { rows } = await client.query(
      `
      SELECT
        r.idtransaccion,
        r.fechainicio,
        r.fechasalida,
        r.horacheckin,
        r.hombres,
        r.mujeres,
        r.idsede,
        r.idbeneficiario
      FROM reserva r
      WHERE r.idtransaccion = $1
      FOR UPDATE;
      `,
      [idTransaccion]
    );

    if (!rows || rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "La reserva no existe.",
        data: [],
      });
    }

    const r = rows[0];

    // 2) Insertar en reservafin (variables locales -> insert)
    await client.query(
      `
      INSERT INTO reservafin (
        idtransaccion, fechainicio, fechasalida, horacheckin,
        hombres, mujeres, idsede, idbeneficiario
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8);
      `,
      [
        r.idtransaccion,
        r.fechainicio,
        r.fechasalida,
        r.horacheckin,
        r.hombres,
        r.mujeres,
        r.idsede,
        r.idbeneficiario,
      ]
    );

    // 3) Eliminar de reserva
    await client.query(`DELETE FROM reserva WHERE idtransaccion = $1;`, [idTransaccion]);

    await client.query("COMMIT");
    return res.json({
      success: true,
      message: "Reserva movida a 'reservafin' y eliminada de 'reserva'.",
      data: [],
      moved: true,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error moviendo reserva a reservafin:", err);
    return res.status(500).json({
      success: false,
      message: "Error moviendo la reserva.",
      data: [],
    });
  } finally {
    client.release();
  }
});
