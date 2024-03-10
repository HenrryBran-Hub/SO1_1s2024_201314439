package main

import (
	"bufio"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strconv"
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

type CPUData struct {
	CPULibre   float64 `json:"cpu_libre"`
	CPUOcupada float64 `json:"cpu_ocupada"`
}

type Procesos struct {
	Procesos []Proceso `json:"procesos"`
}

func init() {
	// Abre la conexión a la base de datos
	var err error
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	connectionString := fmt.Sprintf("%s:%s@tcp(%s)/%s", dbUser, dbPassword, dbHost, dbName)

	db, err = sql.Open("mysql", connectionString)
	if err != nil {
		fmt.Println("Error al conectar a la base de datos:", err)
		panic(err)
	}
}

func MySQLRAM() {
	for {
		// Leer el archivo
		cmd := exec.Command("cat", "/proc/ram_so1_1s2024")
		output, err := cmd.Output()
		if err != nil {
			fmt.Println("Error al leer el archivo MYSQLRAM:", err)
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
			fmt.Println("Error al insertar datos en la base de datos RAM:", err)
			continue
		}

		fmt.Println("Datos guardados en la base de datos RAM.")

		// Esperar un segundo antes de la próxima lectura
		time.Sleep(time.Second)
	}
}

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

func HistoryRAM(w http.ResponseWriter, r *http.Request) {
	// Lógica para obtener el historial de RAM
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	connectionString := fmt.Sprintf("%s:%s@tcp(%s)/%s", dbUser, dbPassword, dbHost, dbName)

	db, err := sql.Open("mysql", connectionString)
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
	cmd := exec.Command("cat", "/proc/cpu_so1_1s2024")
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
			if processMap, ok := process.(map[string]interface{}); ok {
				if pid, ok := processMap["PID"].(string); ok {
					name := processMap["name"].(string)
					pids = append(pids, fmt.Sprintf("PID_%s_(%s)", pid, name))
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
	cmd := exec.Command("cat", "/proc/cpu_so1_1s2024")
	output, err := cmd.Output()
	if err != nil {
		fmt.Println("Error al leer el archivo PROCESS DATA:", err)
		http.Error(w, "Error al leer el archivo PROCES DATA", http.StatusInternalServerError)
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

func MySQLCPU() {
	for {
		// Leer el archivo
		cmd := exec.Command("cat", "/proc/stat")
		stdout, err := cmd.StdoutPipe()
		if err != nil {
			fmt.Println("Error al crear el canal de salida:", err)
			return
		}
		if err := cmd.Start(); err != nil {
			fmt.Println("Error al iniciar el comando:", err)
			return
		}

		var idlePercentage float64

		scanner := bufio.NewScanner(stdout)
		for scanner.Scan() {
			line := scanner.Text()
			fields := strings.Fields(line)
			if fields[0] == "cpu" {
				user, _ := strconv.ParseUint(fields[1], 10, 64)
				nice, _ := strconv.ParseUint(fields[2], 10, 64)
				system, _ := strconv.ParseUint(fields[3], 10, 64)
				idle, _ := strconv.ParseUint(fields[4], 10, 64)
				iowait, _ := strconv.ParseUint(fields[5], 10, 64)
				irql, _ := strconv.ParseUint(fields[6], 10, 64)
				softirq, _ := strconv.ParseUint(fields[7], 10, 64)
				steal, _ := strconv.ParseUint(fields[8], 10, 64)
				guest, _ := strconv.ParseUint(fields[9], 10, 64)
				guest_nice, _ := strconv.ParseUint(fields[10], 10, 64)

				idlePercentage = float64(idle) * 100.0 / float64(user+nice+system+idle+iowait+irql+softirq+steal+guest+guest_nice)
				break
			}
		}

		if err := scanner.Err(); err != nil {
			fmt.Println("Error al leer la salida del comando:", err)
		}

		if err := cmd.Wait(); err != nil {
			fmt.Println("Error al esperar la finalización del comando:", err)
		}

		// Calcular los porcentajes de memoria
		cpuOcupada := 100 - idlePercentage
		currentTime := time.Now()

		// Formatear el tiempo actual como una cadena en formato "5:33:05"
		horaActual := currentTime.Format("15:04:05")

		// Insertar los datos en la base de datos con la hora actual como cadena
		_, err = db.Exec("INSERT INTO cpu_data (cpu_libre, cpu_ocupada, fecha_hora) VALUES (?, ?, ?)",
			idlePercentage, cpuOcupada, horaActual)
		if err != nil {
			fmt.Println("Error al insertar datos en la base de datos CPU:", err)
			continue
		}

		fmt.Println("Datos guardados en la base de datos CPU.")

		// Esperar un segundo antes de la próxima lectura
		time.Sleep(time.Second)
	}
}

func RealTimeCPU(w http.ResponseWriter, r *http.Request) {
	// Lógica para obtener la información en tiempo real de RAM
	cmd := exec.Command("cat", "/proc/stat")
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		fmt.Println("Error al crear el canal de salida:", err)
		return
	}
	if err := cmd.Start(); err != nil {
		fmt.Println("Error al iniciar el comando:", err)
		return
	}

	var idlePercentage float64

	scanner := bufio.NewScanner(stdout)
	for scanner.Scan() {
		line := scanner.Text()
		fields := strings.Fields(line)
		if fields[0] == "cpu" {
			user, _ := strconv.ParseUint(fields[1], 10, 64)
			nice, _ := strconv.ParseUint(fields[2], 10, 64)
			system, _ := strconv.ParseUint(fields[3], 10, 64)
			idle, _ := strconv.ParseUint(fields[4], 10, 64)
			iowait, _ := strconv.ParseUint(fields[5], 10, 64)
			irql, _ := strconv.ParseUint(fields[6], 10, 64)
			softirq, _ := strconv.ParseUint(fields[7], 10, 64)
			steal, _ := strconv.ParseUint(fields[8], 10, 64)
			guest, _ := strconv.ParseUint(fields[9], 10, 64)
			guest_nice, _ := strconv.ParseUint(fields[10], 10, 64)

			idlePercentage = float64(idle) * 100.0 / float64(user+nice+system+idle+iowait+irql+softirq+steal+guest+guest_nice)
			fmt.Printf("Porcentaje de tiempo ocioso de la CPU: %.3f%%\n", idlePercentage)
			break
		}
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error al leer la salida del comando:", err)
	}

	if err := cmd.Wait(); err != nil {
		fmt.Println("Error al esperar la finalización del comando:", err)
	}

	// Calcular los porcentajes de memoria
	cpuOcupada := 100 - idlePercentage

	// Crear un mapa con los datos
	data := CPUData{
		CPULibre:   idlePercentage,
		CPUOcupada: cpuOcupada,
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Error al convertir la estructura en JSON", http.StatusInternalServerError)
		return
	}

	// Escribir la respuesta HTTP con el JSON
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func HistoryCPU(w http.ResponseWriter, r *http.Request) {
	// Lógica para obtener el historial de RAM
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	connectionString := fmt.Sprintf("%s:%s@tcp(%s)/%s", dbUser, dbPassword, dbHost, dbName)

	db, err := sql.Open("mysql", connectionString)
	if err != nil {
		fmt.Println("Error al conectar a la base de datos:", err)
		http.Error(w, "Error al conectar a la base de datos", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Consultar los últimos 25 registros de la tabla ram_data
	rows, err := db.Query("SELECT cpu_libre, cpu_ocupada, fecha_hora FROM (SELECT * FROM cpu_data ORDER BY id DESC LIMIT 25) sub ORDER BY id ASC")
	if err != nil {
		fmt.Println("Error al consultar la base de datos:", err)
		http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Crear una estructura para almacenar los datos
	type Registro struct {
		CPUlibre  float64 `json:"cpu_libre"`
		CPUcupada float64 `json:"cpu_ocupada"`
		FechaHora string  `json:"fecha_hora"`
	}

	var registros []Registro

	// Iterar sobre los registros y guardarlos en la estructura
	for rows.Next() {
		var registro Registro
		err := rows.Scan(&registro.CPUlibre, &registro.CPUcupada, &registro.FechaHora)
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
	go MySQLRAM()
	go MySQLCPU()

	// Crear un nuevo ServeMux
	mux := http.NewServeMux()
	// Endpoint para obtener la información en tiempo real de RAM
	mux.HandleFunc("/realtimemonitor/ram", func(w http.ResponseWriter, r *http.Request) {
		RealTimeRAM(w, r)
	})

	// Endpoint para obtener la información en tiempo real de CPU
	mux.HandleFunc("/realtimemonitor/cpu", func(w http.ResponseWriter, r *http.Request) {
		RealTimeCPU(w, r)
	})

	// Endpoint para obtener el historial de RAM
	mux.HandleFunc("/historymonitor/ram", func(w http.ResponseWriter, r *http.Request) {
		HistoryRAM(w, r)
	})

	// Endpoint para obtener el historial de RAM
	mux.HandleFunc("/historymonitor/cpu", func(w http.ResponseWriter, r *http.Request) {
		HistoryCPU(w, r)
	})

	// Endpoint para obtener los PID del árbol de procesos
	mux.HandleFunc("/processtree/pid", func(w http.ResponseWriter, r *http.Request) {
		ProcessTreePIDHandler(w, r)
	})
	// Endpoint para obtener los json PID del árbol de procesos
	mux.HandleFunc("/processtree/data", func(w http.ResponseWriter, r *http.Request) {
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
