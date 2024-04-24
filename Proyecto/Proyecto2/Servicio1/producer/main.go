package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"
)

func loadConfig() (string, string, string) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error al cargar el archivo .env:", err)
	}

	port := os.Getenv("PORT")
	kafkaBrokers := os.Getenv("KAFKA_BROKERS")
	kafkaTopic := os.Getenv("KAFKA_TOPIC")

	return port, kafkaBrokers, kafkaTopic
}

func sendMessage(w http.ResponseWriter, r *http.Request) {
	_, kafkaBrokers, kafkaTopic := loadConfig()

	producer, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": kafkaBrokers,
	})
	if err != nil {
		http.Error(w, "Error al crear el productor de Kafka", http.StatusInternalServerError)
		return
	}
	defer producer.Close()

	var message struct {
		Topic   string `json:"topic"`
		Message string `json:"message"`
	}

	err = json.NewDecoder(r.Body).Decode(&message)
	if err != nil {
		http.Error(w, "Error al decodificar el cuerpo de la solicitud", http.StatusBadRequest)
		return
	}

	err = producer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &kafkaTopic, Partition: kafka.PartitionAny},
		Value:          []byte(message.Message),
	}, nil)
	if err != nil {
		http.Error(w, "Error al enviar el mensaje a Kafka", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Mensaje enviado exitosamente al tema: %s", kafkaTopic)
}

func main() {
	port, _, _ := loadConfig()

	http.HandleFunc("/sendMessage", sendMessage)
	log.Printf("Escuchando en el puerto %s", port)

	go func() {
		log.Fatal(http.ListenAndServe(":"+port, nil))
	}()

	// Manejar la señal de interrupción para limpiar recursos antes de salir
	sigchan := make(chan os.Signal, 1)
	signal.Notify(sigchan, syscall.SIGINT, syscall.SIGTERM)
	<-sigchan

	log.Println("Recibida señal de interrupción, finalizando...")
}
