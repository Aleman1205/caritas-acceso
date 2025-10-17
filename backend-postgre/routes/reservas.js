import express from "express";
import { crearReserva } from "../controllers/reservasController.js";
import { pool } from "../db/pool.js";

export const router = express.Router();

router.post("/", crearReserva);

router.get('/:telefono', async (req, res) => {
    const { telefono } = req.params;

    try {
        const query = `
        SELECT
        r."idtransaccion",
        r."fechainicio",
        r."fechasalida",
        r."horacheckin",
        r."hombres",
        r."mujeres",
        s."nombre" AS "sede",
        s."ubicacion",
        s."ciudad",
        t."id" AS "transaccionid"
        FROM "reserva" r
        JOIN "beneficiario" b ON r."idbeneficiario" = b."id"
        JOIN "transaccion" t ON r."idtransaccion" = t."id"
        JOIN "sede" s ON r."idsede" = s."id"
        WHERE b."telefono" = $1
        ORDER BY r."fechainicio" DESC
        `;

        const result = await pool.query(query, [telefono]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontrar reservas para este teléfono.'
            });
        }

        const reservas = result.rows.map((r) => {
            let status = "pendiente";
            const now = new Date();

            const fechainicio = new Date(r.fechaInicio);
            const fechasalida = r.fechasalida ? new Date(r.fechasalida) : null;

            if (fechasalida) {
                status = "finalizada";
            } else if (fechainicio <= now) {
                status = "en_estancia";
            }

            return {
                clave: r.idtransaccion.slice(0, 12),
                sede: r.sede,
                ubicacion: r.ubicacion,
                ciudad: r.ciudad,
                fechaInicio: r.fechainicio,
                fechaSalida: r.fechasalida,
                horaCheckIn: r.horacheckin,
                hombres: r.hombres,
                mujeres: r.mujeres,
                status,
            };
        });

        res.status(200).json({
            success: true,
            reservas,
            });
        } catch (err) {
        console.error('Error consultando reservas:', err);
        res.status(500).json({
            success: false,
            message: 'Error consultando reservas'
        });
    }
});

router.put("/:telefono/cancelar", async (req, res) => {
    const { telefono } = req.params;

    try {
        const check = await pool.query(
            `
            SELECT r.idtransaccion
            FROM reserva r
            JOIN beneficiario b ON r.idbeneficiario = b.id
            WHERE b.telefono = $1
            AND (r.fechasalida IS NULL OR r.fechasalida > NOW());
            `,
            [telefono]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró ninguna reserva activa para ete número.",
            });
        }

        const idtransaccion = check.rows[0].idtransaccion;

        await pool.query(
            `
            UPDATE reserva
            SET fechasalida = NOW()
            WHERE idtransaccion = $1;
            `,
            [idtransaccion]
        );

        res.status(200).json({
            success: true,
            message: "Reserva cancelada exitosamente.",
        });
    } catch (err) {
        console.error("Error cancelando reserva:", err);
        res.status(500).json({
            success: false,
            message: "Error al cancelar la reserva.",
        });
    }
});

router.put("/:telefono/confirmar", async (req, res) => {
    const { telefono } = req.params;

    try {
        const check = await pool.query(
            `
            SELECT r.idtransaccion
            FROM reserva r
            JOIN beneficiario b ON r.idbeneficiario = b.id
            WHERE b.telefono = $1
            AND (r.fechasalida IS NULL OR r.fechasalida > NOW());
            `,
            [telefono]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró ninguna reserva activa para este número.",
            });
        }

        const idtransaccion = check.rows[0].idtransaccion;

        await pool.query(
            `
            UPDATE reserva
            SET horacheckin = horacheckin
            WHERE idtransaccion = $1;
            `,
            [idtransaccion]
        );

        res.status(200).json({
            success: true,
            message: "Check-in confirmado exitosamente.",
        });
    } catch (err) {
        console.error("Error confirmado llegada:", err);
        res.status(500).json({
            success: false,
            message: "Error al confirmar la llegada.",
        });
    }
});

router.post("/validarqr", async (req, res) => {
    try {
        const { clave } = req.body;

        if (!clave || clave.length < 6) {
            return res.status(400).json({
                success: false,
                message: "QR inválido o faltante.",
            });
        }

        const result = await pool.query(
            `
            SELECT
            r.idtransaccion,
            b.telefono,
            r.fechainicio,
            r.fechasalida,
            s.nombre AS sede
            FROM reserva r
            JOIN beneficiario b ON r.idbeneficiario = b.id
            JOIN sede s ON r.idsede = s.id
            WHERE r.idtransaccion LIKE $1
            LIMIT 1;
            `,
            [`${clave}%`]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success:false,
                message: "QR no válido o no encontrado.",
            });
        }

        const reserva = result.rows[0];

        if (reserva.fechasalida && new Date(reserva.fechasalida) < new Date ()) {
            return res.status(400).json({
                success: false,
                message: "Esta reserva ya finalizó o fue cancelada.",
            });
        }

        await pool.query(
            `
            UPDATE reserva
            SET horacheckin = horacheckin
            WHERE idtransaccion = $1;
            `,
            [reserva.idtransaccion]
        );

        res.status(200).json({
            success: true,
            message: "QR válido - check-in confirmado.",
            data: {
                telefono: reserva.telefono,
                sede: reserva.sede,
                fechainicio: reserva.fechainicio,
            },
        });
    } catch (err) {
        console.error("Error validando QR:", err);
        res.status(500).json({
            success: false,
            message: "Error al validar el código QR.",
        });
    }
});