import React, { useEffect, useState } from "react";
import NavBar from "./MyNavBar";
import "../styles/ProcessTree.css";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

const ProcessTree = () => {
  const [pids, setPids] = useState([]);
  const [selectedPid, setSelectedPid] = useState("");
  const [network, setNetwork] = useState(null);
  const [errorDeConexion, setErrorDeConexion] = useState(false); // Estado para manejar errores de conexión
  const [msgError, setMsgError] = useState(""); // Estado para manejar mensajes de error

  // Cargar los PIDs cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:8080/processtree/pid")
        .then((response) => response.json())
        .then((data) => {
          // Reiniciar el estado de error de conexión si la solicitud es exitosa
          setErrorDeConexion(false);
          setMsgError("");
          setPids(data);
        })
        .catch((error) => {
          // Manejar errores de conexión
          setErrorDeConexion(true);
          setMsgError("Error de conexión. Inténtelo de nuevo más tarde.");
          console.error("Error de conexión:", error);
        });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Manejar la selección de un PID
  const handleSelectPid = (event) => {
    setSelectedPid(event.target.value);
  };

  // Manejar el clic en el botón
  const handleClick = () => {
    fetch(`http://localhost:8080/processtree/data?proceso=${selectedPid}`)
      .then((response) => response.json())
      .then((processData) => {
        // Cambia 'data' a 'processData'
        const nodes = new DataSet(processData);
        const edges = new DataSet(
          processData.flatMap((proceso, i) =>
            proceso.hijos.map((hijo) => ({
              from: i,
              to: processData.findIndex((p) => p.PID === hijo.PID),
            }))
          )
        );
        const container = document.getElementById("network");
        const data = {
          nodes: nodes,
          edges: edges,
        };
        const options = {};
        setNetwork(new Network(container, data, options));
      })
      .catch((error) => {
        // Manejar errores de conexión
        setErrorDeConexion(true);
        setMsgError("Error de conexión. Inténtelo de nuevo más tarde.");
        console.error("Error de conexión:", error);
      });
  };

  return (
    <div>
      <NavBar />
      <div className="container">
        <h1 className="titulo">Arbol de Procesos</h1>
        <select onChange={handleSelectPid}>
          {pids.map((pid, index) => (
            <option key={index} value={pid}>
              {pid}
            </option>
          ))}
        </select>
        <button onClick={handleClick}>Mostrar árbol de procesos</button>
        {/* Mostrar un mensaje de error si hay un error de conexión */}
        {errorDeConexion && <div className="error-message">{msgError}</div>}
        <div id="network"></div>
      </div>
    </div>
  );
};

export default ProcessTree;
