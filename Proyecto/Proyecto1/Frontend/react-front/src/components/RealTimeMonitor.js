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
  const donaChartRef = useRef(null); // Usar useRef en lugar de let

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
          actualizarGraficoDona();
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
  const actualizarGraficoDona = () => {
    if (donaChartRef.current) {
      donaChartRef.current.data.datasets[0].data = [memoriaLlena, memoriaVacia];
      donaChartRef.current.update();
    }
  };

  useEffect(() => {
    // Crear gráfico de dona
    const ctx = document.getElementById("donaChart").getContext("2d");
    donaChartRef.current = new Chart(ctx, {
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
    return () => donaChartRef.current.destroy();
  }, [memoriaOcupada, memoriaLibre]);
  return (
    <div>
      <NavBar />
      <div className="container">
        <h1 className="titulo">Monitoreo en Tiempo Real</h1>

        {/* Mostrar un mensaje de error si hay un error de conexión */}
        {errorDeConexion && <div className="error-message">{msgerror}</div>}

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
          <canvas id="donaChart" width="300" height="300"></canvas>
        </div>
      </div>
    </div>
  );
};
export default RealTimeMonitor;
