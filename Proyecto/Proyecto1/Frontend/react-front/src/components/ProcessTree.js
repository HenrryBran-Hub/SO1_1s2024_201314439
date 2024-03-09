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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Manejar la selección de un PID
  const handleSelectPid = (event) => {
    setSelectedPid(event.target.value);
  };

  // Manejar el clic en el botón
  const handleClick = () => {
    const selectedOption = selectedPid;
    // Utilizando split
    const parts = selectedOption.split("_");
    const numeroExtraido2 = parts[0] + "_" + parts[1];
    fetch(`http://localhost:8080/processtree/data?proceso=${numeroExtraido2}`)
      .then((response) => response.json())
      .then((processData) => {
        // Crea un array de nodos
        const nodes = new DataSet(
          processData.map((proceso) => ({
            id: proceso.PID,
            label: `${proceso.PID}: ${proceso.name}`,
            title: `
              Name:${proceso.name}
              PID:${proceso.PID}
            `,
          }))
        );

        // Crea un array de aristas (edges) para las relaciones padre-hijo
        const edges = new DataSet(
          processData.flatMap((proceso) =>
            proceso.hijos.map((hijo) => ({
              from: proceso.PID,
              to: hijo.PID,
              arrows: {
                to: { enabled: true }, // Agrega flechas al final de las aristas
              },
            }))
          )
        );

        const container = document.getElementById("network");
        const data = {
          nodes: nodes,
          edges: edges,
        };
        const options = {
          layout: {
            hierarchical: {
              direction: "UD", // Cambia la dirección del árbol de horizontal (LR) a vertical (UD)
            },
          },
          edges: {
            smooth: {
              type: "cubicBezier", // Cambia el tipo de curva para las aristas
            },
          },
          physics: {
            enabled: true, // Habilita la simulación física
            hierarchicalRepulsion: {
              centralGravity: 0.0, // Ajusta la gravedad central para dispersar los nodos
              springLength: 250, // Ajusta la longitud del resorte para las aristas
              springConstant: 0.15, // Ajusta la constante del resorte
              nodeDistance: 200, // Ajusta la distancia entre los nodos
            },
          },
          height: "800px", // Ajusta la altura de la gráfica
          width: "100%", // Ajusta el ancho de la gráfica
        };
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
        <select onChange={handleSelectPid} className="nav-button-process">
          {pids.map((pid, index) => (
            <option key={index} value={pid}>
              {pid}
            </option>
          ))}
        </select>
        <button onClick={handleClick} className="nav-button-process">
          Mostrar árbol de procesos
        </button>
        {/* Mostrar un mensaje de error si hay un error de conexión */}
        {errorDeConexion && <div className="error-message">{msgError}</div>}
        <div id="network" class="img-container"></div>
      </div>
    </div>
  );
};

export default ProcessTree;
