-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS KERNEL;

-- Usar la base de datos recién creada
USE KERNEL;

CREATE TABLE ram_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    memoria_libre FLOAT,
    memoria_total INT,
    memoria_ocupada FLOAT,
    fecha_hora VARCHAR(50)
);

CREATE TABLE cpu_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpu_libre FLOAT,
    cpu_ocupada FLOAT,
    fecha_hora VARCHAR(50)
);