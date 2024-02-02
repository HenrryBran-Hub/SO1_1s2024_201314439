package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/rs/cors"
)

func usuarioHandler(w http.ResponseWriter, r *http.Request) {
	result := "Henrry Bran 201314439"
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"result": result})
}

func fechaHandler(w http.ResponseWriter, r *http.Request) {
	result := time.Now().Format("2006-01-02 15:04:05")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"result": result})
}

func main() {
	mux := http.NewServeMux()

	// Manejadores de tus rutas aquí...
	mux.HandleFunc("/data/user", usuarioHandler)
	mux.HandleFunc("/data/time", fechaHandler)

	// Habilitar CORS para todas las rutas
	handler := cors.Default().Handler(mux)

	// Iniciar el servidor
	fmt.Println("Servidor escuchando en http://localhost:8080")
	http.ListenAndServe(":8080", handler)
}
