# Imagen base
FROM golang:latest

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar el código fuente
COPY . .

# Descargar las dependencias
RUN go mod download

# Compilar la aplicación
RUN go build -o main .

# Exponer el puerto
EXPOSE 3002

# Comando para ejecutar la aplicación
CMD ["/app/main"]