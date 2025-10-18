import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { router as movilRouter } from "./movil/index.js";
import { router as webRouter } from "./web/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/movil", movilRouter);
app.use("/web", webRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});