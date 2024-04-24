package main

import (
	"fmt"
	"log"
	"os"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"
)

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
		} else {
			log.Printf("Error al consumir mensaje: %v", err)
			break
		}
	}
}
