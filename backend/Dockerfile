# Imagen base
FROM node:18

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copia package.json primero
COPY package*.json ./

# Instalcion de dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Exponer el puerto de la app
EXPOSE 3000

# Comando de inicio
CMD ["npm", "run", "build && npm run start"]
