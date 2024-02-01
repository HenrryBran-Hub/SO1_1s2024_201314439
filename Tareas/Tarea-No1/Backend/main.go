package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func usuarioHandler(w http.ResponseWriter, r *http.Request) {
	result := "Nombre: Henrry Bran - 201314439"
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"result": result})

}

func fechaHandler(w http.ResponseWriter, r *http.Request) {
	result := time.Now().Format("2006-01-02 15:04:05")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"result": result})
}

func main() {
	http.HandleFunc("/data/user", usuarioHandler)
	http.HandleFunc("/data/time", fechaHandler)

	fmt.Println("Servidor escuchando en http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
