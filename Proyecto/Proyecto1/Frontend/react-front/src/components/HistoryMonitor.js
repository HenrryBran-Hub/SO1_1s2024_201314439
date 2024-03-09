import { useState, useEffect, useRef } from "react";
import React from "react";
import NavBar from "./MyNavBar";
import "../styles/HistoryMonitor.css";
import Chart from "chart.js/auto";

const HistoryMonitor = () => {
  const [errorDeConexion, setErrorDeConexion] = useState(false);
  const [msgerror, setMsgError] = useState("");
  const lineChartRefRAM = useRef(null); // Usar useRef en lugar de let
  const lineChartRefCPU = useRef(null);

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
          actualizarGraficoLineasRAM(memoriaOcupada, memoriaLibre, fecha);
        })
        .catch((error) => {
          setErrorDeConexion(true);
          setMsgError("Error de conexión. Inténtelo de nuevo más tarde.");
          console.error("Error de conexión:", error);
        });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  const actualizarGraficoLineasRAM = (memoriaOcupada, memoriaLibre, fecha) => {
    if (lineChartRefRAM.current) {
      // Verifica si hay datos antes de actualizar el gráfico
      lineChartRefRAM.current.data.labels = fecha;
      lineChartRefRAM.current.data.datasets[0].data = memoriaOcupada;
      lineChartRefRAM.current.data.datasets[1].data = memoriaLibre;
      lineChartRefRAM.current.update();
    }
  };

  useEffect(() => {
    // Crear gráfico de dona
    const ctx = document.getElementById("lineChartRAM").getContext("2d");
    lineChartRefRAM.current = new Chart(ctx, {
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
    return () => lineChartRefRAM.current.destroy();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://localhost:8080/historymonitor/cpu")
        .then((response) => response.json())
        .then((data) => {
          setErrorDeConexion(false);
          setMsgError("");
          const fecha = data.map((dato) => dato.fecha_hora);
          const cpuocupada = data.map((dato) => dato.cpu_ocupada);
          const cpulibre = data.map((dato) => dato.cpu_libre);
          actualizarGraficoLineasCPU(cpuocupada, cpulibre, fecha);
        })
        .catch((error) => {
          setErrorDeConexion(true);
          setMsgError("Error de conexión. Inténtelo de nuevo más tarde.");
          console.error("Error de conexión:", error);
        });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  const actualizarGraficoLineasCPU = (cpuocupada, cpuLibre, fecha) => {
    if (lineChartRefCPU.current) {
      // Verifica si hay datos antes de actualizar el gráfico
      lineChartRefCPU.current.data.labels = fecha;
      lineChartRefCPU.current.data.datasets[0].data = cpuocupada;
      lineChartRefCPU.current.data.datasets[1].data = cpuLibre;
      lineChartRefCPU.current.update();
    }
  };

  useEffect(() => {
    // Crear gráfico de dona
    const ctx = document.getElementById("lineChartCPU").getContext("2d");
    lineChartRefCPU.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "CPU Ocupada",
            data: [],
            borderColor: "#36a2eb",
            fill: false,
          },
          {
            label: "CPU Libre",
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
    return () => lineChartRefCPU.current.destroy();
  }, []);

  return (
    <div>
      <NavBar />
      <h1 className="titulo">Monitoreo Historico</h1>
      <table style={{ width: "100%" }}>
        <tr>
          <td style={{ width: "50%", padding: "20px" }}>
            <div className="container">
              {errorDeConexion && (
                <div className="error-message">{msgerror}</div>
              )}
              <h4 className="titulo-dos">Memoria Ram</h4>
              <div className="chart-container-graf">
                <canvas id="lineChartRAM" width="800" height="400"></canvas>
              </div>
            </div>
          </td>
          <td style={{ width: "50%", padding: "20px" }}>
            <div className="container">
              {errorDeConexion && (
                <div className="error-message">{msgerror}</div>
              )}
              <h4 className="titulo-dos">CPU</h4>
              <div className="chart-container-graf">
                <canvas id="lineChartCPU" width="800" height="400"></canvas>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};
export default HistoryMonitor;
