import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const dbPool: Pool = await mysql.createPool({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  ssl: { rejectUnauthorized: false }, // necesario para Aiven/Render
  typeCast: (field, next) => {
    if (field.type === "NEWDECIMAL" || field.type === "DECIMAL") {
      const val = field.string();
      return val === null ? null : Number(val);
    }
    if (["TINY", "SHORT", "LONG"].includes(field.type)) {
      const val = field.string();
      return val === null ? null : Number(val);
    }
    if (field.type === "BIT" && field.length === 1) {
      const bytes = field.buffer();
      return bytes !== null ? bytes[0] === 1 : null;
    }
    return next();
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
