# Tarea No. 1 SO1

---
---

Acontinuacion se tendra el desarrollo de la tarea No. 1 de SO1

## Video de Demostración de Docker :movie_camera:

### Enlace al Video con Miniatura
[![Miniatura del Video(hacer click en la imagen)](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/Video.gif)](https://www.youtube.com/watch?v=CSL-jXgtDT8)

### otros-Links :link:

1. [Enunciado de la Tarea](https://drive.google.com/file/d/1UuAVq9pKQgrtWaybUG6rS5NsQkd4TTrd/view?usp=sharing)
2. [Link de Video(por si no fuciona el de arriba)](https://www.youtube.com/watch?v=CSL-jXgtDT8)

---
---

## Comandos utilizados en el backend de docker 

```javascript
//Para crear nuestro contenedor 
docker build --tag backend .
```

![Creacion de contenedor](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/B-b.gif)

```javascript
//Para ejecutar el contenedor de docker (el -d sirve para ejecutar en segundo plano el contenedor)
docker run -d -p 8080:8080 backend:latest
```

![Ejecucion de Contenedor](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/D-BE.gif)

### MOSTRANDO ARCHIVO DOCKERFILE

![Ejecucion de Contenedor](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/D-b.gif)

### PROBANDO ENDPOINTS

#### endpoint con /data/user en postman

![Ejecucion de Contenedor](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/P-U.gif)

#### endpoint con /data/time en postman

![Ejecucion de Contenedor](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/P-T.gif)

---
---

## Comandos utilizados en el frontend de docker 

```javascript
//Para crear nuestro contenedor 
docker build --tag frontend-react .
```
![Creacion de contenedor](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/F-b.gif)

```javascript
//Para ejecutar el contenedor de docker (el -d sirve para ejecutar en segundo plano el contenedor)
docker run -d -p 3000:3000 frontend-react:latest
```
![Ejecucion de Contenedor](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/F-e.gif)

### MOSTRANDO ARCHIVO DOCKERFILE

![Ejecucion de Contenedor](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/D-f.gif)

---
---

### OTROS COMANDOS UTILIZADOS
```javascript
//Para ver los contenedores que se estan ejecutando
docker ps
```
![Ejecucion de comando](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/D-p.gif)

```javascript
//Para ver los contenedors que se han creado
docker image ls
```
![Ejecucion de comando](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/D-I.gif)

```javascript
//Para detener la ejecion de un contenedor donde ID es la CONTAINER ID vista en docker ps
docker stop ID
```

![Ejecucion de comando](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/D-ST.gif)

## EJECUCION DE AMBOS CONTENEDORES

![Ejecucion de comando](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/D-E2.gif))
---

## MOSTRANDO RESULTADO

![Ejecucion de comando](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/datas.gif)
---

## :large_orange_diamond: EXTRA :large_orange_diamond:

Agregamos un archivo (frontend-react) a docker hub mediante la siguiente forma
---
![Ejecucion de comando](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/D-D.gif)
---
Se agrego esa extension de docker y sale un menu emergente para hacer el docker push.
Ya por ultimo verificamos en nuestro docker hub 
---
![Ejecucion de comando](https://github.com/HenrryBran-Hub/SO1_1s2024_201314439/blob/main/Tareas/Tarea-No1/Img/D-H.gif)
---
