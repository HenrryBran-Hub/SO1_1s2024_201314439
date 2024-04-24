package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"

	pb "grpcServer/server"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedGetInfoServer
}

type Data struct {
	Name  string
	Album string
	Year  string
	Rank  string
}

func (s *server) ReturnInfo(ctx context.Context, in *pb.RequestId) (*pb.ReplyInfo, error) {
	fmt.Println("Recibí de cliente: ", in.GetName())
	data := Data{
		Year:  in.GetYear(),
		Album: in.GetAlbum(),
		Name:  in.GetName(),
		Rank:  in.GetRank(),
	}
	fmt.Println(data)
	sendToServer(data)
	return &pb.ReplyInfo{Info: "Hola cliente, recibí el album"}, nil
}

func sendToServer(data Data) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Fatalf("Error marshaling data: %v", err)
	}

	// Obtener la URL del servidor desde la variable de entorno
	serverURL := os.Getenv("SERVER_URL")

	resp, err := http.Post(serverURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Fatalf("Error sending data: %v", err)
	}
	defer resp.Body.Close()

	fmt.Println("Data sent to producer successfully")
}

func main() {
	fmt.Println("Inicio el servicio")
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	var (
		port = ":" + os.Getenv("PORT")
	)

	listen, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalln(err)
	}
	s := grpc.NewServer()
	pb.RegisterGetInfoServer(s, &server{})

	if err := s.Serve(listen); err != nil {
		log.Fatalln(err)
	}
}
