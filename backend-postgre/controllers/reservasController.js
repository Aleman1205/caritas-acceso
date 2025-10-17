import { pool } from "../db/pool.js";
import crypto from "crypto";

export async function crearReserva(req, res) {
    try {
        const {
            nombre,
            telefono,
            email,
            hombres,
            mujeres,
            fechaInicio,
            horaCheckIn,
            idSede,
        } = req.body;

        const checkExisting = await pool.query(
            `
            SELECT r.idtransaccion
            FROM reserva r
            JOIN beneficiario b ON r.idbeneficiario = b.id
            WHERE b.telefono = $1
            AND (r.fechasalida IS NULL OR r.fechasalida > NOW());
            `,
            [telefono]
        );

        if (checkExisting.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message:
                "Ya existe una reserva activa para este número. Espere a completar o cancelar su estancia.",
            });
        }

        const benefResult = await pool.query(
            `INSERT INTO Beneficiario (Telefono, Nombre, Email)
            VALUES ($1, $2, $3)
            ON CONFLICT (Telefono) DO UPDATE SET NOMBRE = EXCLUDED.Nombre
            RETURNING Id;`,
            [telefono, nombre, email]
        );
        const idBeneficiario = benefResult.rows[0].id;

        const transactionId = crypto.randomBytes(8).toString("hex");
        await pool.query(
            `INSERT INTO Transaccion (Id, Tipo) VALUES ($1, 'reserva')`,
            [transactionId]
        );

        await pool.query(
            `INSERT INTO Reserva(
            IdTransaccion, FechaInicio, HoraCheckIn, Hombres, Mujeres, IdSede, IdBeneficiario
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
             [transactionId, fechaInicio, horaCheckIn, hombres, mujeres, idSede, idBeneficiario]
        );

        const clave = crypto.createHash("sha256").update(transactionId).digest("hex").slice(0, 12);

        res.json({
            success: true,
            clave,
            transactionId,
            message: "Reserva creada exitosamente",
        });
    } catch (error) {
        console.error("Error creando reserva:", error);
        res.status(500).json({ success: false, message: "Error creando reserva" });
    }
}