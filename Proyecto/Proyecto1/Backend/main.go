package main

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"

	"github.com/gorilla/handlers"

	"github.com/rs/cors"

	_ "github.com/go-sql-driver/mysql"
)

func RealTimeRAM(w http.ResponseWriter, r *http.Request) {
	// Lógica para obtener la información en tiempo real de RAM
	cmd := exec.Command("cat", "/proc/ram_so1_1s2024")
	output, err := cmd.Output()
	if err != nil {
		fmt.Println("Error al leer el archivo RealTimeRAM:", err)
		http.Error(w, "Error al leer el archivo RealTimeRAM", http.StatusInternalServerError)
		return
	}

	// Escribir el JSON en la respuesta
	w.Header().Set("Content-Type", "application/json")
	w.Write(output)
}

func main() {

	// Crear un nuevo ServeMux
	mux := http.NewServeMux()
	// Endpoint para obtener la información en tiempo real de RAM
	mux.HandleFunc("/realtimemonitor/ram", func(w http.ResponseWriter, r *http.Request) {
		RealTimeRAM(w, r)
	})

	// Iniciar el servidor HTTP con el ServeMux
	loggedRouter := handlers.LoggingHandler(os.Stdout, mux)

	// Configura el middleware CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Permite todas las origenes
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"}, // Métodos permitidos
	})

	handler := c.Handler(loggedRouter)

	// Iniciar el servidor y registrar un mensaje
	go func() {
		fmt.Println("Iniciando el servidor en http://localhost:8080")
		if err := http.ListenAndServe(":8080", handler); err != nil {
			fmt.Println("Error al iniciar el servidor:", err)
		}
	}()

	select {}

}
