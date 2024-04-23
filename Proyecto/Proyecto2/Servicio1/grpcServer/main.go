package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"
	"os"

	pb "grpcServer/server"

	_ "github.com/go-sql-driver/mysql" // Importación agregada
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedGetInfoServer
}

const (
	port = ":3001"
)

type Data struct {
	Name  string
	Album string
	Year  string
	Rank  string
}

var db *sql.DB

func initDB() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPassword, dbHost, dbPort, dbName)

	// Abre la conexión a la base de datos
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error connecting to the database: %v", err)
	}

	// Verifica si la conexión a la base de datos es válida
	err = db.Ping()
	if err != nil {
		log.Fatalf("Error pinging database: %v", err)
	}
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
	//insertDB(data)
	return &pb.ReplyInfo{Info: "Hola cliente, recibí el album"}, nil
}

func insertDB(data Data) {
	// Insert data into the database
	stmt, err := db.Prepare("INSERT INTO Banda (Name, Album, Year, Ranked) VALUES (?, ?, ?, ?)")
	if err != nil {
		log.Fatalf("Error preparing statement: %v", err)
	}
	defer stmt.Close()

	_, execErr := stmt.Exec(data.Name, data.Album, data.Year, data.Rank)
	if execErr != nil {
		log.Fatalf("Error executing statement: %v", execErr)
	}
	fmt.Println("Data inserted successfully")
}

func main() {
	fmt.Println("Inicio el servicio")
	//initDB()
	//defer db.Close()

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
