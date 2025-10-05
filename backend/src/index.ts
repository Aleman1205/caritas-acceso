import express from "express";
import sedeRoutes from "./routes/sede.js"
import servicioRoutes from "./routes/servicio.js"
import sedeServiciosRoutes from "./routes/sede-servicio.js"
import compraRoutes from "./routes/compra.js"
import paradaRoutes from "./routes/parada.js"
import rutaRoutes from "./routes/ruta.js"
import usuarioRoutes from "./routes/usuario.js"

const app = express();

app.use(express.json());
app.use("/api/sedes", sedeRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/sede-servicios", sedeServiciosRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/paradas", paradaRoutes);
app.use("/api/rutas", rutaRoutes);
app.use("/api/usuarios", usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
});
