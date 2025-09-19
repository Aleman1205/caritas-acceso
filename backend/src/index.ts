import express from "express";
import sedeRoutes from "./routes/sede.js"

const app = express();
app.use(express.json());

app.use("/api/sedes", sedeRoutes);

const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
});