import express from "express";
import sedeRoutes from "./routes/sede.js"
import servicioRoutes from "./routes/servicio.js"

const app = express();
app.use(express.json());

app.use("/api/sedes", sedeRoutes);
app.use("/api/servicios", servicioRoutes);

const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
});
