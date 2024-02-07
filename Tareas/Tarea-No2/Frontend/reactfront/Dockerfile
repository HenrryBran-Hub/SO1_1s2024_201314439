# Establecer la imagen base
FROM node:latest

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de la aplicación al contenedor
COPY . .

# Instalar las dependencias del proyecto
RUN npm install

# Construir la aplicación de producción
RUN npm run build

# Exponer el puerto en el que escucha la aplicación
EXPOSE 3000

# Comando por defecto para iniciar la aplicación cuando se inicie el contenedor
CMD ["npm", "start"]