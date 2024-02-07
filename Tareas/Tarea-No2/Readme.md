# Tarea No. 2 SO1

---
---

Acontinuacion se tendra el desarrollo de la tarea No. 2 de SO1

## Video de Demostración de Docker :movie_camera:

### Enlace al Video con Miniatura
[![Miniatura del Video(hacer click en la imagen)](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No2/Img/3.gif)](https://www.youtube.com/watch?v=AFv2sWa93bY)

### otros-Links :link:

1. [Enunciado de la Tarea](https://drive.google.com/file/d/11szoxHyT4ttULUhjYMRqQAXJK5a42be3/view?usp=sharing)
2. [Link de Video(por si no fuciona el de arriba)](https://www.youtube.com/watch?v=AFv2sWa93bY)

---
---

## Archivo de docker-compose

```javascript
version: '3.8'

services:
  nodeback:
    container_name: node_container
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - mongo
    networks:
      - my_network

  reactfront:
    container_name: react_container
    build: ../Frontend/reactfront   # Ruta al directorio que contiene el Dockerfile para el reactfront
    ports:
      - "3000:3000"
    depends_on:
      - nodeback
    networks:
      - my_network

  mongo:
    container_name: mongo_container
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - my_network

networks:
  my_network:

volumes:
  mongo_data:


```

## Comandos mas utilizados

![Ejecucion de comando](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No2/Img/1.gif)
---

## :large_orange_diamond: Ingreso a la BD de mongo :large_orange_diamond:

Mostramos como ingresamos a mongo DB
---
![Ejecucion de comando](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No2/Img/2.gif)
---
