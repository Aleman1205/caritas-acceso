import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

export const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesDir = path.join(__dirname, "routes");

fs.readdirSync(routesDir).forEach((file) => {
    if (file.endsWith(".js")) {
        const routePath = path.join(routesDir, file);
        const routeURL = pathToFileURL(routePath).href;

        import(routeURL).then((module) => {
            const routeName = file.replace(".js", "");
            router.use(`/${routeName}`, module.router);
            console.log(`Loaded web route: /web/${routeName}`);
        });
    }
});