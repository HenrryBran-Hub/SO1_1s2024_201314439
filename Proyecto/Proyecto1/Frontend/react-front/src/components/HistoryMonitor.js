import { useState, useEffect } from "react";
import React from "react";
import NavBar from "./MyNavBar";
import "../styles/HistoryMonitor.css";
import Chart from "chart.js/auto";

const HistoryMonitor = () => {
  const [data, setData] = useState([]);
  const [errorDeConexion, setErrorDeConexion] = useState(false);
  let lineChartRef = null;

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://localhost:8080/realtimemonitor/ram")
        .then((response) => response.json())
        .then((data) => {
          setErrorDeConexion(false);
          setData(data);
          actualizarGraficoLineas(data);
          console.log(data);
        })
        .catch((error) => {
          setErrorDeConexion(true);
          console.error("Error de conexión:", error);
        });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  const actualizarGraficoLineas = (data) => {
    if (lineChartRef) {
      const fechas = data.map((dato) => dato.fecha_hora);
      const memoriaOcupada = data.map((dato) => dato.memoria_ocupada);
      const memoriaLibre = data.map((dato) => dato.memoria_libre);

      lineChartRef.data.labels = fechas;
      lineChartRef.data.datasets[0].data = memoriaOcupada;
      lineChartRef.data.datasets[1].data = memoriaLibre;
      lineChartRef.update();
    }
  };

  useEffect(() => {
    const ctx = document.getElementById("lineChart").getContext("2d");
    lineChartRef = new Chart(ctx, {
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
            type: "time",
            time: {
              parser: "HH:mm:ss",
              tooltipFormat: "HH:mm:ss",
              unit: "second",
              displayFormats: {
                second: "HH:mm:ss",
              },
            },
          },
        },
      },
    });

    return () => lineChartRef.destroy();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container">
        <h1 className="titulo">Monitoreo en Tiempo Real</h1>

        {errorDeConexion && (
          <div className="error-message">
            Error de conexión. Inténtelo de nuevo más tarde.
          </div>
        )}

        <div className="chart-container">
          <canvas id="lineChart" width="800" height="400"></canvas>
        </div>
      </div>
    </div>
  );
};
export default HistoryMonitor;
