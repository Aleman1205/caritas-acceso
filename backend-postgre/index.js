import express from "express";
import cors from "cors";
import { router as reservasRouter } from "./routes/reservas.js";
import { router as serviciosRouter } from "./routes/servicios.js";
import { router as sedesRouter } from "./routes/sedes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/reservas", reservasRouter);
app.use("/servicios", serviciosRouter);
app.use("/sedes", sedesRouter);

app.get("/", (req, res) => res.send("Caritas Servicio API is running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));