-- Script para crear la base de datos
CREATE DATABASE IF NOT EXISTS Tarea4;

-- Usar la base de datos recién creada
USE Tarea4;

-- Script para crear la tabla
CREATE TABLE IF NOT EXISTS Banda (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Album VARCHAR(255) NOT NULL,
    Year VARCHAR(4) NOT NULL,
    Ranked VARCHAR(10) NOT NULL
);