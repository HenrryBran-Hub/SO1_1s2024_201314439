import { useState, useEffect, useRef } from "react";
import React from "react";
import NavBar from "./MyNavBar";
import "../styles/HistoryMonitor.css";
import Chart from "chart.js/auto";

const HistoryMonitor = () => {
  const [errorDeConexion, setErrorDeConexion] = useState(false);
  const lineChartRef = useRef(null); // Usar useRef en lugar de let

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://localhost:8080/historymonitor/ram")
        .then((response) => response.json())
        .then((data) => {
          setErrorDeConexion(false);
          const fecha = data.map((dato) => dato.fecha_hora);
          const memoriaOcupada = data.map((dato) => dato.memoria_ocupada);
          const memoriaLibre = data.map((dato) => dato.memoria_libre);

          console.log("/////INGRESO/////");
          console.log(memoriaOcupada);
          console.log(memoriaLibre);
          console.log(fecha);
          console.log("/////INGRESO/////");
          actualizarGraficoLineas(memoriaOcupada, memoriaLibre, fecha);
        })
        .catch((error) => {
          setErrorDeConexion(true);
          console.error("Error de conexión:", error);
        });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  const actualizarGraficoLineas = (memoriaOcupada, memoriaLibre, fecha) => {
    if (lineChartRef.current) {
      // Verifica si hay datos antes de actualizar el gráfico
      console.log("/////ACTUALIZACION/////");
      console.log(memoriaOcupada);
      console.log(memoriaLibre);
      console.log(fecha);
      console.log("/////ACTUALIZACION/////");
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
        <h1 className="titulo">Monitoreo en Tiempo Real</h1>

        {errorDeConexion && (
          <div className="error-message">
            Error de conexión. Inténtelo de nuevo más tarde.
          </div>
        )}

        <div className="chart-container-graf">
          <canvas id="lineChart" width="800" height="400"></canvas>
        </div>
      </div>
    </div>
  );
};
export default HistoryMonitor;
