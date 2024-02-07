# Usamos una imagen base de Node.js
FROM node:latest

RUN mkdir -p /usr/src/app
# Establece el directorio de trabajo en /app
WORKDIR /usr/src/app

# Copiar los archivos de la aplicación al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Construir la aplicación de producción
COPY . .

# Expone el puerto en el que la aplicación se ejecuta
EXPOSE 5000

# Comando para ejecutar la aplicación cuando el contenedor se inicia
CMD ["npm","start"]

