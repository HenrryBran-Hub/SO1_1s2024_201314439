import { useState, useEffect } from "react";
import logo from "./assets/images/logo-universal.png";
import "./App.css";
import { Greet } from "../wailsjs/go/main/App";
import Chart from "chart.js/auto";

function App() {
  const [memoriaLibre, setMemoriaLibre] = useState(0);
  const [memoriaOcupada, setMemoriaOcupada] = useState(0);
  const [memoriaTotal, setMemoriaTotal] = useState(0);
  const [memoriaLlena, setMemoriaLlena] = useState(0);
  const [memoriaVacia, setMemoriaVacia] = useState(0);
  let donaChartRef = null;

  useEffect(() => {
    const intervalId = setInterval(() => {
      Greet().then((data) => {
        const jsonData = JSON.parse(data);
        const memoriaLibre = jsonData.memoria_libre;
        const memoriaOcupada = jsonData.memoria_ocupada;
        const memoriaTotal = jsonData.memoria_total;

        // Calcular los valores con solo dos decimales
        const memoriaVacia = +((memoriaLibre / memoriaTotal) * 100).toFixed(2);
        const memoriaLlena = +((memoriaOcupada / memoriaTotal) * 100).toFixed(
          2
        );

        // Actualizar el estado con los valores calculados
        setMemoriaLibre(memoriaLibre);
        setMemoriaOcupada(memoriaOcupada);
        setMemoriaTotal(memoriaTotal);
        setMemoriaVacia(memoriaVacia);
        setMemoriaLlena(memoriaLlena);
        actualizarGraficoDona();
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Función para actualizar el gráfico de dona
  const actualizarGraficoDona = () => {
    if (donaChartRef) {
      donaChartRef.data.datasets[0].data = [memoriaLlena, memoriaVacia];
      donaChartRef.update();
    }
  };

  useEffect(() => {
    // Crear gráfico de dona
    const ctx = document.getElementById("donaChart").getContext("2d");
    donaChartRef = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Lleno", "Vacio"],
        datasets: [
          {
            data: [memoriaOcupada, memoriaLibre],
            backgroundColor: ["#36a2eb", "#ff6384"],
          },
        ],
      },
    });

    // Devuelve una función de limpieza para detener el intervalo cuando el componente se desmonta
    return () => donaChartRef.destroy();
  }, [memoriaOcupada, memoriaLibre]); // El array vacío como segundo argumento asegura que este efecto solo se ejecute una vez al montar el componente

  return (
    <div id="App">
      <img src={logo} id="logo" alt="logo" />
      <div className="result-container">
        <h1>RAM</h1>
      </div>
      <div className="result-container">
        <label>Memoria Libre:</label>
        <span>{memoriaLibre}</span>
      </div>
      <div className="result-container">
        <label>Memoria Ocupada:</label>
        <span>{memoriaOcupada}</span>
      </div>
      <div className="result-container">
        <label>Memoria Total:</label>
        <span>{memoriaTotal}</span>
      </div>
      <div className="result-container">
        <label>Porcentaje Memoria Vacia:</label>
        <span>{memoriaVacia} %</span>
      </div>
      <div className="result-container">
        <label>Porcentaje Memoria LLena:</label>
        <span>{memoriaLlena} %</span>
      </div>
      <div className="chart-container" style={{ width: "50%", margin: "auto" }}>
        <canvas id="donaChart" width="200" height="200"></canvas>
      </div>
    </div>
  );
}

export default App;
