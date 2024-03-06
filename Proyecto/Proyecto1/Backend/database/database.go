package database

import (
	"database/sql"
	"fmt"
	"time"
)

func SaveData(db *sql.DB, memoria_libre, memoria_total, memoria_ocupada int) error {
	currentTime := time.Now()
    _, err := db.Exec("INSERT INTO ram_data (memoria_libre, memoria_total, memoria_ocupada, fecha_hora) VALUES (?, ?, ?, ?)",
        memoria_libre, memoria_total, memoria_ocupada, currentTime)
    if err != nil {
        return err
    }

    fmt.Println("Datos guardados en la base de datos.")
    return nil
}
