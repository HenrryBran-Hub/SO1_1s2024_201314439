package file_reader

import (
	"encoding/json"
	"os/exec"
)

func ReadFile(filePath string) (map[string]int, error) {
    cmd := exec.Command("cat", filePath)
    output, err := cmd.Output()
    if err != nil {
        return nil, err
    }

    var data map[string]int
    err = json.Unmarshal(output, &data)
    if err != nil {
        return nil, err
    }

    return data, nil
}
