import { pool } from "../../compartido/db/pool.js";

export async function obtenerPromedioRating(req, res) {
  try {
    const { id_sede } = req.params;

    if (!id_sede) {
      return res.status(400).json({
        success: false,
        message: "Falta el parámetro 'id_sede'",
      });
    }

    // 🔍 Consulta SQL: promedio y total de reseñas
    const query = `
      SELECT 
        s.id AS id_sede,
        s.nombre AS sede,
        ROUND(AVG(r.int_estrellas), 2) AS promedio,
        COUNT(r.id) AS total_reviews
      FROM rating r
      JOIN sede s ON r.id_sede = s.id
      WHERE s.id = $1
      GROUP BY s.id, s.nombre;
    `;

    const { rows } = await pool.query(query, [id_sede]);

    // 🚫 Sin reseñas
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron reseñas para esta sede",
      });
    }

    // ✅ Respuesta exitosa
    res.status(200).json({
      success: true,
      message: "Promedio obtenido correctamente",
      data: rows[0],
    });

  } catch (error) {
    console.error("Error al obtener promedio de ratings:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener promedio de ratings",
      error: error.message,
    });
  }
}

export async function crearRating(req, res) {
  try {
    const { int_estrellas, comentarios, id_sede } = req.body;

    // 🧩 Validación de campos requeridos
    if (!int_estrellas || !id_sede) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: 'int_estrellas' o 'id_sede'",
      });
    }

    // 🚀 Inserción en la base de datos
    const query = `
      INSERT INTO rating (int_estrellas, comentarios, id_sede)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;

    const { rows } = await pool.query(query, [
      int_estrellas,
      comentarios || null,
      id_sede,
    ]);

    // ✅ Respuesta exitosa
    res.status(201).json({
      success: true,
      message: "Rating registrado correctamente",
      id: rows[0].id,
    });
  } catch (error) {
    console.error("Error al crear rating:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear rating",
      error: error.message,
    });
  }
}
