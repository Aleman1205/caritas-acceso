import { pool } from "../config/db";
import { Beneficiario } from "../types/beneficiario";

// Obtener todos los beneficiarios
export const obtenerBeneficiariosDB = async () => {
  const [rows] = await pool.query("SELECT * FROM Beneficiario");
  return rows;
};

// Obtener beneficiarios por transacción
export const obtenerBeneficiariosPorTransaccionDB = async (idTransaccion: string) => {
  const [rows] = await pool.query(
    "SELECT * FROM Beneficiario WHERE IdTransaccion = ?",
    [idTransaccion]
  );
  return rows;
};

// Crear nuevo beneficiario
export const crearBeneficiarioDB = async (beneficiario: Beneficiario) => {
  const { Telefono, IdTransaccion, Nombre, Apellido, Email } = beneficiario;
  const [result] = await pool.query(
    `INSERT INTO Beneficiario (Telefono, IdTransaccion, Nombre, Apellido, Email)
     VALUES (?, ?, ?, ?, ?)`,
    [Telefono, IdTransaccion, Nombre, Apellido, Email]
  );
  return result;
};

// Eliminar beneficiario (por Teléfono + IdTransacción)
export const eliminarBeneficiarioDB = async (telefono: string, idTransaccion: string) => {
  const [result] = await pool.query(
    `DELETE FROM Beneficiario WHERE Telefono = ? AND IdTransaccion = ?`,
    [telefono, idTransaccion]
  );
  return result;
};
