import { useState, useEffect, useRef } from "react";
import React from "react";
import NavBar from "./MyNavBar";
import "../styles/HistoryMonitor.css";
import Chart from "chart.js/auto";

const HistoryMonitor = () => {
  const [errorDeConexion, setErrorDeConexion] = useState(false);
  const [msgerror, setMsgError] = useState("");
  const lineChartRef = useRef(null); // Usar useRef en lugar de let

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://localhost:8080/historymonitor/ram")
        .then((response) => response.json())
        .then((data) => {
          setErrorDeConexion(false);
          setMsgError("");
          const fecha = data.map((dato) => dato.fecha_hora);
          const memoriaOcupada = data.map((dato) => dato.memoria_ocupada);
          const memoriaLibre = data.map((dato) => dato.memoria_libre);
          actualizarGraficoLineas(memoriaOcupada, memoriaLibre, fecha);
        })
        .catch((error) => {
          setErrorDeConexion(true);
          setMsgError("Error de conexión. Inténtelo de nuevo más tarde.");
          console.error("Error de conexión:", error);
        });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  const actualizarGraficoLineas = (memoriaOcupada, memoriaLibre, fecha) => {
    if (lineChartRef.current) {
      // Verifica si hay datos antes de actualizar el gráfico
      lineChartRef.current.data.labels = fecha;
      lineChartRef.current.data.datasets[0].data = memoriaOcupada;
      lineChartRef.current.data.datasets[1].data = memoriaLibre;
      lineChartRef.current.update();
    }
  };

  useEffect(() => {
    // Crear gráfico de dona
    const ctx = document.getElementById("lineChart").getContext("2d");
    lineChartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Memoria Ocupada",
            data: [],
            borderColor: "#36a2eb",
            fill: false,
          },
          {
            label: "Memoria Libre",
            data: [],
            borderColor: "#ff6384",
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "category",
          },
        },
      },
    });

    // Devuelve una función de limpieza para detener el intervalo cuando el componente se desmonta
    return () => lineChartRef.current.destroy();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container">
        <h1 className="titulo">Monitoreo Historico</h1>
        {errorDeConexion && <div className="error-message">{msgerror}</div>}
        <h4 className="titulo-dos">Memoria Ram</h4>
        <div className="chart-container-graf">
          <canvas id="lineChart" width="800" height="400"></canvas>
        </div>
      </div>
    </div>
  );
};
export default HistoryMonitor;
