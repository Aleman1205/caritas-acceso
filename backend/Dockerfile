# Imagen base: trae Node 18 listo
FROM node:18

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json (si existe) primero
COPY package*.json ./

# Instala dependencias (aprovecha la cache de Docker)
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto donde escucha la app
EXPOSE 3000

# Arranque por defecto en producción (build y start).
CMD sh -c "npm run build && npm run start"