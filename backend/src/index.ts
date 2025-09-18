import express from "express";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/sedes");

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});