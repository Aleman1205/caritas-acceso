import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import dotenv from "dotenv";


dotenv.config();

['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE'].forEach((key) => {
  if (!process.env[key]) throw new Error(`Falta la variable de entorno ${key}`);
});

export const dbPool: Pool = await mysql.createPool({
    host: process.env.MYSQL_HOST!,
    port: Number(process.env.MYSQL_PORT) || 3306!,
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    database: process.env.MYSQL_DATABASE!,
    typeCast: (field, next) => {
        // Convierte DECIMAL y NUMERIC a Number
        if (field.type === 'NEWDECIMAL' || field.type === 'DECIMAL') {
          const val = field.string();
          return val === null ? null : Number(val);
        }

        // Convierte INT a Number
        if (field.type === 'TINY' || field.type === 'SHORT' || field.type === 'LONG') {
          const val = field.string();
          return val === null ? null : Number(val);
        }

        // Convierte BIT(1) a Boolean
        if (field.type === 'BIT' && field.length === 1) {
          const bytes = field.buffer();
          return bytes !== null ? bytes[0] === 1 : null;
        }

        return next();
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

try {
  const connection = await dbPool.getConnection();
  console.log("Conectado a la base de datos MySQL");
  connection.release();
} catch (error) {
  console.error("Error al conectar a MySQL:", error);
}