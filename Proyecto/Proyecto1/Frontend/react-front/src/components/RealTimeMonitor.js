import { useState, useEffect } from "react";
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
  const [errorDeConexion, setErrorDeConexion] = useState(false); // Estado para manejar errores de conexión
  let donaChartRef = null;

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://localhost:8080/realtimemonitor/ram")
        .then((response) => response.json())
        .then((data) => {
          // Reiniciar el estado de error de conexión si la solicitud es exitosa
          setErrorDeConexion(false);

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
          actualizarGraficoDona();
          console.log(data);
        })
        .catch((error) => {
          // Manejar errores de conexión
          setErrorDeConexion(true);
          console.error("Error de conexión:", error);
        });
    }, 2500);

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
  }, [memoriaOcupada, memoriaLibre]);

  return (
    <div>
      <NavBar />
      <div className="container">
        <h1 className="titulo">Monitoreo en Tiempo Real</h1>

        {/* Mostrar un mensaje de error si hay un error de conexión */}
        {errorDeConexion && (
          <div className="error-message">
            Error de conexión. Inténtelo de nuevo más tarde.
          </div>
        )}

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
        <div
          className="chart-container"
          style={{ width: "50%", margin: "auto" }}
        >
          <canvas id="donaChart" width="200" height="200"></canvas>
        </div>
      </div>
    </div>
  );
};
export default RealTimeMonitor;
