import { useState, useEffect, useRef } from "react";
import React from "react";
import NavBar from "./MyNavBar";
import "../styles/RealTimeMonitor.css";
import Chart from "chart.js/auto";

const RealTimeMonitor = () => {
  const [memoriaLibre, setMemoriaLibre] = useState(0);
  const [memoriaOcupada, setMemoriaOcupada] = useState(0);
  const [memoriaTotal, setMemoriaTotal] = useState(0);
  const [memoriaLlena, setMemoriaLlena] = useState(0);
  const [memoriaVacia, setMemoriaVacia] = useState(0);
  const [msgerror, setMsgError] = useState("");
  const [errorDeConexion, setErrorDeConexion] = useState(false); // Estado para manejar errores de conexión
  const donaChartRefRAM = useRef(null); // Usar useRef en lugar de let
  const [cpuLibre, setCPULibre] = useState(0);
  const [cpuOcupada, setCPUOcupada] = useState(0);
  const donaChartRefCPU = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://localhost:8080/realtimemonitor/ram")
        .then((response) => response.json())
        .then((data) => {
          // Reiniciar el estado de error de conexión si la solicitud es exitosa
          setErrorDeConexion(false);
          setMsgError("");
          const memoriaLibre = data.memoria_libre;
          const memoriaOcupada = data.memoria_ocupada;
          const memoriaTotal = data.memoria_total;

          // Calcular los valores con solo dos decimales
          const memoriaVacia = +((memoriaLibre / memoriaTotal) * 100).toFixed(
            2
          );
          const memoriaLlena = +((memoriaOcupada / memoriaTotal) * 100).toFixed(
            2
          );

          // Actualizar el estado con los valores calculados
          setMemoriaLibre(memoriaLibre);
          setMemoriaOcupada(memoriaOcupada);
          setMemoriaTotal(memoriaTotal);
          setMemoriaVacia(memoriaVacia);
          setMemoriaLlena(memoriaLlena);
          actualizarGraficoDonaRAM();
          console.log(data);
        })
        .catch((error) => {
          // Manejar errores de conexión
          setErrorDeConexion(true);
          setMsgError("Error de conexión. Inténtelo de nuevo más tarde.");
          console.error("Error de conexión:", error);
        });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  // Función para actualizar el gráfico de dona
  const actualizarGraficoDonaRAM = () => {
    if (donaChartRefRAM.current) {
      donaChartRefRAM.current.data.datasets[0].data = [
        memoriaLlena,
        memoriaVacia,
      ];
      donaChartRefRAM.current.update();
    }
  };

  useEffect(() => {
    // Crear gráfico de dona
    const ctx = document.getElementById("donaChartRAM").getContext("2d");
    donaChartRefRAM.current = new Chart(ctx, {
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
    return () => donaChartRefRAM.current.destroy();
  }, [memoriaOcupada, memoriaLibre]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://localhost:8080/realtimemonitor/cpu")
        .then((response) => response.json())
        .then((data) => {
          // Reiniciar el estado de error de conexión si la solicitud es exitosa
          setErrorDeConexion(false);
          setMsgError("");
          const cpuLibre = data.cpu_libre;
          const cpuOcupada = data.cpu_ocupada;

          // Actualizar el estado con los valores calculados
          setCPULibre(cpuLibre);
          setCPUOcupada(cpuOcupada);
          actualizarGraficoDonaCPU();
          console.log(data);
        })
        .catch((error) => {
          // Manejar errores de conexión
          setErrorDeConexion(true);
          setMsgError("Error de conexión. Inténtelo de nuevo más tarde.");
          console.error("Error de conexión:", error);
        });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  // Función para actualizar el gráfico de dona
  const actualizarGraficoDonaCPU = () => {
    if (donaChartRefCPU.current) {
      donaChartRefCPU.current.data.datasets[0].data = [cpuOcupada, cpuLibre];
      donaChartRefCPU.current.update();
    }
  };

  useEffect(() => {
    // Crear gráfico de dona
    const ctx = document.getElementById("donaChartCPU").getContext("2d");
    donaChartRefCPU.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Lleno", "Vacio"],
        datasets: [
          {
            data: [cpuOcupada, cpuLibre],
            backgroundColor: ["#36a2eb", "#ff6384"],
          },
        ],
      },
    });

    // Devuelve una función de limpieza para detener el intervalo cuando el componente se desmonta
    return () => donaChartRefCPU.current.destroy();
  }, [cpuOcupada, cpuLibre]);

  return (
    <div>
      <NavBar />
      <h1 className="titulo">Monitoreo en Tiempo Real</h1>
      <table style={{ width: "100%" }}>
        <tr>
          <td style={{ width: "50%", padding: "20px" }}>
            <div className="container">
              {errorDeConexion && (
                <div className="error-message">{msgerror}</div>
              )}
              <h1 className="titulo">RAM</h1>
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
                <label>Porcentaje Memoria Llena:</label>
                <span>{memoriaLlena} %</span>
              </div>
              <div className="chart-container">
                <canvas id="donaChartRAM"></canvas>
              </div>
            </div>
          </td>
          <td style={{ width: "50%", padding: "20px" }}>
            {/* Repetir el mismo contenido aquí */}
            <div className="container">
              {errorDeConexion && (
                <div className="error-message">{msgerror}</div>
              )}
              <h1 className="titulo">CPU</h1>
              <div className="result-container">
                <label>cpu libre:</label>
                <span>{cpuLibre} %</span>
              </div>
              <div className="result-container">
                <label>cpu Ocupada:</label>
                <span>{cpuOcupada} %</span>
              </div>
              <div className="chart-container">
                <canvas id="donaChartCPU"></canvas>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};
export default RealTimeMonitor;
