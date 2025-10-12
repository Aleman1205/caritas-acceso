import { pool } from "../config/db";
import { Reserva } from "../types/reserva";

// Obtener todas las reservas
export const obtenerReservasDB = async () => {
  const [rows] = await pool.query("SELECT * FROM Reserva");
  return rows;
};

// Obtener reserva por transacción
export const obtenerReservaPorTransaccionDB = async (idTransaccion: string) => {
  const [rows] = await pool.query(
    "SELECT * FROM Reserva WHERE IdTransaccion = ?",
    [idTransaccion]
  );
  return rows;
};

// Crear nueva reserva
export const crearReservaDB = async (reserva: Reserva) => {
  const { IdTransaccion, FechaInicio, FechaSalida, NumeroPersonas, IdSede } = reserva;
  const [result] = await pool.query(
    `INSERT INTO Reserva (IdTransaccion, FechaInicio, FechaSalida, NumeroPersonas, IdSede)
     VALUES (?, ?, ?, ?, ?)`,
    [IdTransaccion, FechaInicio, FechaSalida, NumeroPersonas, IdSede]
  );
  return result;
};

// Eliminar reserva por IdTransaccion
export const eliminarReservaDB = async (idTransaccion: string) => {
  const [result] = await pool.query(
    `DELETE FROM Reserva WHERE IdTransaccion = ?`,
    [idTransaccion]
  );
  return result;
};
