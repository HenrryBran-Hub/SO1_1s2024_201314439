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

```

Basicamente instalamos los paquetes en los main de cada archivo y cambiamos la estructura del a favor del json que estamos enviando, y tambien se esta mostrando el contenido.

---

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

# levantamos los secrets de primero
