import express from "express";
import cors from "cors";
import reservasRouter from "./routes/reservas.routes.js"; // import explícito (sin autoloader)

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Healthcheck
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Monta el router de reservas bajo este prefijo:
app.use("/api/web/reservas", reservasRouter);

// 404 de depuración (déjalo al final)
app.use((req, res) => {
  res.status(404).json({ error: "No route", path: req.path });
});

export default app;
