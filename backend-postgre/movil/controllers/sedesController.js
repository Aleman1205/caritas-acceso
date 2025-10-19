import { pool } from "../../compartido/db/pool.js";

export async function listarSedes(req, res) {
    try {
        const query = `
        SELECT
        s.id,
        s.nombre,
        s.ubicacion,
        s.ciudad,
        s.horainicio,
        s.horafinal,
        s.descripcion,
        COALESCE(SUM(CAST(ss.capacidad AS INTEGER)), 0) AS capacidadtotal
        FROM sede s
        LEFT JOIN sedeservicio ss
        ON ss.idsede = s.id
        AND ss.estatus = TRUE
        GROUP BY
        s.id, s.nombre, s.ubicacion, s.ciudad, s.horainicio, s.horafinal, s.descripcion
        ORDER BY s.id;
        `;

        const { rows } = await pool.query(query);
        return res.status(200).json({ success: true, sedes: rows });
    } catch (err) {
        console.error("Error consultando sedes:", err);
        return res
        .status(500)
        .json({ success: false, message: "Error consultando sedes:" });
    }
}

export async function listarServiciosPorSede(req, res) {
    const { id } = req.params;

    try {
        const query = `
        SELECT
        ss.idservicio,
        sv.nombre AS nombreservicio,
        ss.descripcion,
        ss.capacidad,
        ss.precio,
        ss.horainicio,
        ss.horafinal,
        ss.estatus
        FROM sedeservicio ss
        JOIN servicio sv ON ss.idservicio = sv.id
        WHERE ss.idsede = $1
        ORDER BY sv.nombre;
        `;

        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron servicios para esta sede."
            });
        }

        return res.status(200).json({
            success: true,
            servicios: rows
        });
    } catch (err) {
        console.error("Error consultando servicios de sede:", err);
        return res.status(500).json({
            success: false,
            message: "Error consultando servicios de la sede."
        });
    }
}