# Usa una imagen base de Golang
FROM golang:latest

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el código fuente del proyecto al contenedor
COPY . .

# Compila el código
RUN go build -o backend .

# Exponer el puerto en el que escucha tu aplicación
EXPOSE 8080

# Comando por defecto para ejecutar tu aplicación cuando se inicie el contenedor
CMD ["./backend"]
