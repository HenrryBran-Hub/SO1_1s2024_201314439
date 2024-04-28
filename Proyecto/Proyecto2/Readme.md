# EXPLICACION DE PROYECTO 2

# probamos lo de locust

levantamos locust con este comando

```javascript
# instalamos locust de forma global esto se hace afuera en cmd

sudo apt install python3-locust

# instalamos de manera local

pip3 install locust

# ejecutamos locust

locust -f traffic.py

```

![locust](../Proyecto2/Img/1.png)

Todo esto lo hacemos en la carpeta de locust del servicio1, ahi esta el archivo python y lo que se le cambio generalmente es el nombre del archivo json que se cargara en la linea 29 el album.json

---

# probamos lo de gRPC

levantamos los servicios de gRPC

```javascript
# instalamos el compilador de protobuf esto se hace afuera en cmd

sudo apt install protobuf-compiler

# Como exiten cliente y servidor se instalan los paquetes que necesitan ambos proyectos

go get github.com/gofiber/fiber/v2

go get google.golang.org/grpc

go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Ejecutamos el gRPC para que nos cree los archivos estos son los que estan dentro de las carpetas client y server

protoc --go_out=. --go-grpc_out=. client.proto

protoc --go_out=. --go-grpc_out=. server.proto

# creamos ejecutables

go build grpcClient

go build grpcServer

# ejecutamos los archivos anteriores

./grpcClient

./grpcServer


# Creamos sus imagenes de grpcClient y grpcServer

docker build -t henrrybran/grpcclient:latest .

docker build -t henrrybran/grpcserver:latest .

# Subimos las imagenes a dockerhub previamente hecho el login

docker push henrrybran/grpcclient:latest

docker push henrrybran/grpcserver:latest

```

![archivos yaml](../Proyecto2/Img/3.png)

![archivos yaml](../Proyecto2/Img/4.png)

![archivos yaml](../Proyecto2/Img/5.png)

![archivos yaml](../Proyecto2/Img/6.png)

![archivos yaml](../Proyecto2/Img/7.png)

Basicamente instalamos los paquetes en los main de cada archivo y cambiamos la estructura a favor del json que estamos enviando, y tambien se esta mostrando el contenido, tambien para ejecutar el cliente y servidor hay que crear sus ejecutables y sus imagenes de docker las subimos.

---

# creamos nuestro kubernete en la area que especificamos

instalamos el sdk de gcloud

![archivos yaml](../Proyecto2/Img/15.png)

definimos una zona 

![archivos yaml](../Proyecto2/Img/13.png)

creamos nuestro cluster

![archivos yaml](../Proyecto2/Img/14.png)

mostramos nuestra zona y nuestro cluester creado

![archivos yaml](../Proyecto2/Img/16.png)



# creamos nuestro namespace

sopes1

```javascript
kubectl create ns sopes1
```

nota:mantener el mismo namespace en todo para que no haya problemas de conexion

---

# creamos nuestro servidor de kafka

```javascript
kubectl create -f 'https://strimzi.io/install/latest?namespace=sopes1' -n sopes1
kubectl apply -f https://strimzi.io/examples/latest/kafka/kafka-persistent-single.yaml -n sopes1
```

nota: levantamos el zookepper, brokers y otra

# Antes de ejecutar obiamente necesitamos crear los dockerfile estos se encuentran en cada carpeta

estos los creamos siempre con los comandose especificos y los subimos

```javascript

# Creamos sus imagenes de grpcClient y grpcServer

docker build -t henrrybran/<nombre_imagen>:latest .

# Subimos las imagenes a dockerhub previamente hecho el login

docker push henrrybran/<nombre_imagen>:latest

```

![funcionamiento](../Proyecto2/Img/12.png)

# ejecutamos los secrets del consumidor de kafka

```javascript
kubectl apply -f ./secrets/

kubectl apply -f ./deployments/

kubectl apply -f ./services/

kubectl apply -f ./ingress/

```

# levantamos los secrets de primero

# Creamos el producto y consumdor de kafka

```javascript
# Creamos las imagenes
docker build -t henrrybran/producer:latest .

docker build -t henrrybran/consumer:latest .

# Subimos las imagenes

docker push henrrybran/producer:latest

docker push henrrybran/consumer:latest

```

Basicamente en esta parte hacemos la conexion de productores y consumidores con kafka se instalan los paquetes.

# En este punto instalamos kafka

# Para redis

```javascript
kubectl exec -it -n sopes1 redis-6fbbbc7b97-c9vtw -- bash
root@redis-6fbbbc7b97-c9vtw:/data# redis-cli
127.0.0.1:6379> AUTH YOUR_PASSWORD
OK
127.0.0.1:6379> keys *
1) "total"
2) "Banda"
3) "Ranked"
127.0.0.1:6379>
```

# Intalacion de la api Node js

```javascript
# Creamos las imagenes
docker build -t henrrybran/apinodejs:latest .

docker build -t henrrybran/vauweb:latest .

# Subimos las imagenes

docker push henrrybran/apinodejs:latest

docker push henrrybran/vauweb:latest

```
# Para la instalacion de grafana y redis y mongo

para la instalcion de estos componente se necesita simplemente los archivos yaml que ya tenemos hechos y que se encuentran en la carpeta deployments, secrets y services

```javascript
kubectl apply -f ./secrets/

kubectl apply -f ./deployments/

kubectl apply -f ./services/
```

y para la conexion de grafana con redis hay que hacer este cambio 

![funcionamiento](../Proyecto2/Img/11.png)

# Cremos nuestras dos cloudrun

![funcionamiento](../Proyecto2/Img/17.png)

# Mostramos nuestra pagina de vue js

![funcionamiento](../Proyecto2/Img/18.png)

# Se realizan unas pruebas al sistema de kubernetes tanto los productores como api node js de cloud run

![funcionamiento](../Proyecto2/Img/19.png)

![funcionamiento](../Proyecto2/Img/20.png)

# Mostramos nuestros pods creados

![funcionamiento](../Proyecto2/Img/21.png)

# Mostramos nuestros servicios creados

![funcionamiento](../Proyecto2/Img/22.png)

# Mostramos nuestros confimap creados

![funcionamiento](../Proyecto2/Img/23.png)

# Mostramos nuestros secrets creados

![funcionamiento](../Proyecto2/Img/24.png)

# Mostramos nuestros ingress creados

![funcionamiento](../Proyecto2/Img/25.png)

# Mostramos como funciona la app

ingresamos a locust

![funcionamiento](../Proyecto2/Img/8.png)

despues ingresamos a nuestra pagina cloudrun

![funcionamiento](../Proyecto2/Img/9.png)

por ultimo ingresamos a grafana

![funcionamiento](../Proyecto2/Img/10.png)
