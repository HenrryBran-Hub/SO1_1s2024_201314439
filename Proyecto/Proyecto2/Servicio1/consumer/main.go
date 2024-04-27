package main

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"

	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"encoding/json"

	"github.com/go-redis/redis/v8"
)

type Album struct {
	Name  string `json:"name"`
	Album string `json:"album"`
	Year  string `json:"year"`
	Rank  string `json:"rank"`
}

func sendLogToMongo(data string) {
	// Obtener variables de entorno para MongoDB
	mongoURI := os.Getenv("MONGO_URI")

	// Crear cliente MongoDB
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoURI))
	if err != nil {
		fmt.Printf("Error al conectar a MongoDB: %v\n", err)
		return
	}
	defer client.Disconnect(context.Background())

	// Obtener la colección de logs
	collection := client.Database("mydb").Collection("logs")

	// Crear el documento de log
	now := time.Now()
	log := map[string]interface{}{
		"fecha": now.Format("2006-01-02"),
		"hora":  now.Format("15:04:05"),
		"dato":  data,
	}

	// Insertar el documento en la colección
	_, err = collection.InsertOne(context.Background(), log)
	if err != nil {
		fmt.Printf("Error al insertar log en MongoDB: %v\n", err)
		return
	}

	fmt.Printf("Log enviado a MongoDB: %v\n", log)
}

func connectAndSendToRedis(data string) {
	// Obtener variables de entorno para Redis
	redisHost := os.Getenv("REDIS_HOST")
	redisPassword := os.Getenv("REDIS_PASSWORD")
	redisAddr := redisHost + ":6379"

	// Crear cliente Redis
	rdb := redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: redisPassword,
		DB:       0,
	})

	// Decodificar el JSON
	var album Album
	err := json.Unmarshal([]byte(data), &album)
	if err != nil {
		fmt.Printf("Error al decodificar el JSON: %v\n", err)
		return
	}

	// Convertir el string a float64
	f, err := strconv.ParseFloat(album.Rank, 64)
	if err != nil {
		fmt.Println("Error al convertir el string a float64:", err)
		return
	}

	// Imprimir el resultado
	fmt.Println("El valor en float64 es:", f)

	// Enviar datos a Redis
	err = rdb.HIncrByFloat(context.Background(), "Ranked", album.Album, f).Err()
	if err != nil {
		fmt.Printf("Error al enviar datos a Redis: %v\n", err)
		return
	}

	// Enviar datos a Redis
	err = rdb.HIncrBy(context.Background(), "Banda", album.Name, 1).Err()
	if err != nil {
		fmt.Printf("Error al enviar datos a Redis: %v\n", err)
		return
	}

	err = rdb.Incr(context.Background(), "total").Err()
	if err != nil {
		fmt.Printf("Error al enviar datos a Redis: %v\n", err)
		return
	}

	fmt.Printf("Datos enviados a Redis: %+v\n", album)
}

func main() {
	// Cargar variables de entorno desde .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error al cargar el archivo .env")
	}

	// Obtener variables de entorno
	kafkaBrokers := os.Getenv("KAFKA_BROKERS")
	kafkaTopic := os.Getenv("KAFKA_TOPIC")

	// Configurar consumidor Kafka
	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": kafkaBrokers,
		"group.id":          "my-group",
		"auto.offset.reset": "earliest",
	})
	if err != nil {
		log.Fatalf("Error al crear el consumidor Kafka: %v", err)
	}
	defer consumer.Close()

	// Suscribirse al topic
	err = consumer.Subscribe(kafkaTopic, nil)
	if err != nil {
		log.Fatalf("Error al suscribirse al topic: %v", err)
	}

	// Escuchar mensajes de Kafka
	fmt.Printf("Escuchando el topic: %s\n", kafkaTopic)
	for {
		msg, err := consumer.ReadMessage(-1)
		if err == nil {
			fmt.Printf("Mensaje recibido: %s\n", string(msg.Value))
			connectAndSendToRedis(string(msg.Value))
			//sendLogToMongo(string(msg.Value))
		} else {
			log.Printf("Error al consumir mensaje: %v", err)
			break
		}
	}
}
