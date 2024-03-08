package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/gorilla/handlers"

	"github.com/rs/cors"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

type Proceso struct {
	PID    string    `json:"PID"`
	Name   string    `json:"name"`
	State  string    `json:"state"`
	Memory string    `json:"memory"`
	UserID string    `json:"userid"`
	Hijos  []Proceso `json:"hijos"`
}

type Procesos struct {
	Procesos []Proceso `json:"procesos"`
}

func init() {
	// Abre la conexión a la base de datos
	var err error
	db, err = sql.Open("mysql", "root:123abc@tcp(localhost:3306)/KERNEL")
	if err != nil {
		fmt.Println("Error al conectar a la base de datos:", err)
		panic(err)
	}
}

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

		// Calcular los porcentajes de memoria
		memoriaLibre := float64(data["memoria_libre"]) / float64(data["memoria_total"]) * 100.00
		memoriaOcupada := float64(data["memoria_ocupada"]) / float64(data["memoria_total"]) * 100.00

		currentTime := time.Now()

		// Formatear el tiempo actual como una cadena en formato "5:33:05"
		horaActual := currentTime.Format("15:04:05")

		// Insertar los datos en la base de datos con la hora actual como cadena
		_, err = db.Exec("INSERT INTO ram_data (memoria_libre, memoria_total, memoria_ocupada, fecha_hora) VALUES (?, ?, ?, ?)",
			memoriaLibre, data["memoria_total"], memoriaOcupada, horaActual)
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
	rows, err := db.Query("SELECT memoria_libre, memoria_total, memoria_ocupada, fecha_hora FROM (SELECT * FROM ram_data ORDER BY id DESC LIMIT 25) sub ORDER BY id ASC")
	if err != nil {
		fmt.Println("Error al consultar la base de datos:", err)
		http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Crear una estructura para almacenar los datos
	type Registro struct {
		MemoriaLibre   float32 `json:"memoria_libre"`
		MemoriaTotal   float32 `json:"memoria_total"`
		MemoriaOcupada float32 `json:"memoria_ocupada"`
		FechaHora      string  `json:"fecha_hora"`
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

func ProcessTreePID() ([]string, error) {
	// Ejecutar el comando para leer el archivo JSON
	cmd := exec.Command("cat", "/proc/cpu_201314439")
	output, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("error al ejecutar el comando: %w", err)
	}

	// Decodificar el JSON
	var data map[string]interface{}
	if err := json.Unmarshal(output, &data); err != nil {
		return nil, fmt.Errorf("error al decodificar el JSON: %w", err)
	}

	// Extraer los PID
	var pids []string
	if processes, ok := data["procesos"].([]interface{}); ok {
		for _, process := range processes {
			if pidMap, ok := process.(map[string]interface{})["PID"]; ok {
				if pid, ok := pidMap.(string); ok {
					pids = append(pids, "PID_"+pid)
				}
			}
		}
	}

	return pids, nil
}

func ProcessTreePIDHandler(w http.ResponseWriter, r *http.Request) {
	// Obtener los PID
	pids, err := ProcessTreePID()
	if err != nil {
		http.Error(w, "Error al obtener los PID", http.StatusInternalServerError)
		return
	}

	// Convertir los PID a JSON
	response, err := json.Marshal(pids)
	if err != nil {
		http.Error(w, "Error al convertir los PID a JSON", http.StatusInternalServerError)
		return
	}

	// Escribir la respuesta
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}

func GetProcessData(w http.ResponseWriter, r *http.Request) {
	// Obtener el valor del campo "proceso" de la consulta
	processID := r.URL.Query().Get("proceso")

	// Separar el número del PID
	pidParts := strings.Split(processID, "_")
	if len(pidParts) != 2 {
		http.Error(w, "El formato del PID no es válido", http.StatusBadRequest)
		return
	}
	pid := pidParts[1]

	// Ejecutar el comando para leer el archivo JSON
	cmd := exec.Command("cat", "/proc/cpu_201314439")
	output, err := cmd.Output()
	if err != nil {
		fmt.Println("Error al leer el archivo:", err)
		http.Error(w, "Error al leer el archivo", http.StatusInternalServerError)
		return
	}

	// Decodificar el JSON
	var data map[string]interface{}
	if err := json.Unmarshal(output, &data); err != nil {
		http.Error(w, "Error al decodificar el JSON", http.StatusInternalServerError)
		return
	}

	// Buscar el proceso con el PID correspondiente
	var procesos Procesos
	json.Unmarshal(output, &procesos)

	var related []Proceso
	var visited = make(map[string]bool)
	findRelated(procesos.Procesos, pid, &related, visited)

	relatedJson, _ := json.MarshalIndent(related, "", "\t")
	//fmt.Println(string(relatedJson))

	// Escribir la respuesta
	w.Header().Set("Content-Type", "application/json")
	w.Write(relatedJson)
}

func findRelated(procesos []Proceso, pid string, related *[]Proceso, visited map[string]bool) {
	for _, proceso := range procesos {
		if proceso.PID == pid && !visited[pid] {
			*related = append(*related, proceso)
			visited[pid] = true
			for _, hijo := range proceso.Hijos {
				if !visited[hijo.PID] {
					findRelated(procesos, hijo.PID, related, visited)
				}
			}
		}
	}
}

func main() {
	// Ejecutar la rutina para cargar datos a MySQL
	//go MySQLRam()

	// Mantener la rutina principal en espera
	// Crear un nuevo ServeMux
	mux := http.NewServeMux()
	/*
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
	*/
	// Endpoint para obtener los PID del árbol de procesos
	mux.HandleFunc("/processtree/pid", func(w http.ResponseWriter, r *http.Request) {
		// Lógica para obtener el historial de RAM
		ProcessTreePIDHandler(w, r)
	})

	mux.HandleFunc("/processtree/data", func(w http.ResponseWriter, r *http.Request) {
		// Lógica para obtener el historial de RAM
		GetProcessData(w, r)
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

	http.ListenAndServe(":8080", handler)

	select {}
}
