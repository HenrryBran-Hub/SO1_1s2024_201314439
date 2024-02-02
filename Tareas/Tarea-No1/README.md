# Tarea No. 1 SO1

---
---

## Comandos utilizados en el backend de docker 

```javascript
//Para crear nuestro contenedor 
docker build --tag backend .
```

![Creacion de contenedor](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)

```javascript
//Para ejecutar el contenedor de docker (el -d sirve para ejecutar en segundo plano el contenedor)
docker run -d -p 8080:8080 backend:latest
```

![Ejecucion de Contenedor](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)

### MOSTRANDO ARCHIVO DOCKERFILE

![Ejecucion de Contenedor](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)

### PROBANDO ENDPOINTS

#### endpoint con /data/user en postman

![Ejecucion de Contenedor](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)

#### endpoint con /data/time en postman

![Ejecucion de Contenedor](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)

---
---

## Comandos utilizados en el frontend de docker 

```javascript
//Para crear nuestro contenedor 
docker build --tag frontend-react .
```
![Creacion de contenedor](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)

```javascript
//Para ejecutar el contenedor de docker (el -d sirve para ejecutar en segundo plano el contenedor)
docker run -d -p 3000:3000 frontend-react:latest
```
![Ejecucion de Contenedor](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)

### MOSTRANDO ARCHIVO DOCKERFILE

![Ejecucion de Contenedor](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)

---
---

### OTROS COMANDOS UTILIZADOS
```javascript
//Para ver los contenedores que se estan ejecutando
docker ps
```
![Ejecucion de comando](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)

```javascript
//Para ver los contenedors que se han creado
docker image ls
```
![Ejecucion de comando](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)

```javascript
//Para detener la ejecion de un contenedor donde ID es la CONTAINER ID vista en docker ps
docker stop ID
```

![Ejecucion de comando](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)

## EJECUCION DE AMBOS CONTENEDORES

![Ejecucion de comando](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)
---

## MOSTRANDO RESULTADO

![Ejecucion de comando](https://github.com/HenrryBran-Hub/Proyecto-1/blob/Develop/Imagenes/Editor.png)
---

