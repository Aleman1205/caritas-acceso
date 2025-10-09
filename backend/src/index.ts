import express from "express";

// Rutas principales
import sedeRoutes from "./routes/sede.js";
import servicioRoutes from "./routes/servicio.js";
import sedeServiciosRoutes from "./routes/sede-servicio.js";
import paradaRoutes from "./routes/parada.js";
import rutaRoutes from "./routes/ruta.js";
import beneficiarioRoutes from "./routes/beneficiario.js";
import reservaRoutes from "./routes/reserva.js";

const app = express();

app.use(express.json());

// Endpoints API
app.use("/api/sedes", sedeRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/sede-servicios", sedeServiciosRoutes);
app.use("/api/paradas", paradaRoutes);
app.use("/api/rutas", rutaRoutes);
app.use("/api/beneficiarios", beneficiarioRoutes);
app.use("/api/reservas", reservaRoutes);

// Ruta por defecto (404)
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
