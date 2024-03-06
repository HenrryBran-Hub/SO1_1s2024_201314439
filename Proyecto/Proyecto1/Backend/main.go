package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"time"

	"github.com/rs/cors"

	_ "github.com/go-sql-driver/mysql"
)

func MySQLRam() {
	for {
		// Leer el archivo
		cmd := exec.Command("cat", "/proc/ram_201314439")
		output, err := cmd.Output()
		if err != nil {
			fmt.Println("Error al leer el archivo:", err)
			continue
		}

		// Decodificar el JSON
		var data map[string]int
		err = json.Unmarshal(output, &data)
		if err != nil {
			fmt.Println("Error al decodificar el JSON:", err)
			continue
		}

		// Conectar a la base de datos
		db, err := sql.Open("mysql", "root:123abc@tcp(localhost:3306)/KERNEL")
		if err != nil {
			fmt.Println("Error al conectar a la base de datos:", err)
			continue
		}
		defer db.Close()

		currentTime := time.Now()

		// Formatear el tiempo actual como una cadena en formato "5:33:05"
		horaActual := currentTime.Format("15:04:05")

		// Insertar los datos en la base de datos con la hora actual como cadena
		_, err = db.Exec("INSERT INTO ram_data (memoria_libre, memoria_total, memoria_ocupada, fecha_hora) VALUES (?, ?, ?, ?)",
			data["memoria_libre"], data["memoria_total"], data["memoria_ocupada"], horaActual)
		if err != nil {
			fmt.Println("Error al insertar datos en la base de datos:", err)
			continue
		}

		fmt.Println("Datos guardados en la base de datos.")

		// Esperar un segundo antes de la próxima lectura
		time.Sleep(time.Second)
	}
}

func RealTimeRam(w http.ResponseWriter, r *http.Request) {
	// Lógica para obtener la información en tiempo real de RAM
	cmd := exec.Command("cat", "/proc/ram_201314439")
	output, err := cmd.Output()
	if err != nil {
		fmt.Println("Error al leer el archivo:", err)
		http.Error(w, "Error al leer el archivo", http.StatusInternalServerError)
		return
	}

	// Escribir el JSON en la respuesta
	w.Header().Set("Content-Type", "application/json")
	w.Write(output)
}

func HistoryRam(w http.ResponseWriter, r *http.Request) {
	// Lógica para obtener el historial de RAM
	db, err := sql.Open("mysql", "root:123abc@tcp(localhost:3306)/KERNEL")
	if err != nil {
		fmt.Println("Error al conectar a la base de datos:", err)
		http.Error(w, "Error al conectar a la base de datos", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Consultar los últimos 25 registros de la tabla ram_data
	rows, err := db.Query("SELECT memoria_libre, memoria_total, memoria_ocupada, fecha_hora FROM ram_data ORDER BY fecha_hora DESC LIMIT 25")
	if err != nil {
		fmt.Println("Error al consultar la base de datos:", err)
		http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Crear una estructura para almacenar los datos
	type Registro struct {
		MemoriaLibre   int    `json:"memoria_libre"`
		MemoriaTotal   int    `json:"memoria_total"`
		MemoriaOcupada int    `json:"memoria_ocupada"`
		FechaHora      string `json:"fecha_hora"`
	}

	var registros []Registro

	// Iterar sobre los registros y guardarlos en la estructura
	for rows.Next() {
		var registro Registro
		err := rows.Scan(&registro.MemoriaLibre, &registro.MemoriaTotal, &registro.MemoriaOcupada, &registro.FechaHora)
		if err != nil {
			fmt.Println("Error al escanear el registro:", err)
			http.Error(w, "Error al escanear el registro", http.StatusInternalServerError)
			return
		}
		registros = append(registros, registro)
	}

	// Verificar si hubo un error durante el escaneo de los registros
	if err := rows.Err(); err != nil {
		fmt.Println("Error al obtener los registros:", err)
		http.Error(w, "Error al obtener los registros", http.StatusInternalServerError)
		return
	}

	// Convertir los registros a formato JSON y enviar la respuesta
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(registros)
}

func main() {
	// Ejecutar la rutina para cargar datos a MySQL
	go MySQLRam()

	// Mantener la rutina principal en espera
	// Crear un nuevo ServeMux
	mux := http.NewServeMux()

	// Endpoint para obtener la información en tiempo real de RAM
	mux.HandleFunc("/realtimemonitor/ram", func(w http.ResponseWriter, r *http.Request) {
		// Lógica para obtener la información en tiempo real de RAM
		RealTimeRam(w, r)
	})

	// Endpoint para obtener el historial de RAM
	mux.HandleFunc("/historymonitor/ram", func(w http.ResponseWriter, r *http.Request) {
		// Lógica para obtener el historial de RAM
		HistoryRam(w, r)
	})

	// Iniciar el servidor HTTP con el ServeMux
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":8080", handler)

	select {}
}
