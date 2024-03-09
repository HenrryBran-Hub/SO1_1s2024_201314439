import React, { useState, useEffect } from "react";
import NavBar from "./MyNavBar";
import { DataSet, Network } from "vis-network/standalone";
import "../styles/SimulateProcess.css";

const SimulateProcess = () => {
  const [processes, setProcesses] = useState([]);
  const [network, setNetwork] = useState(null);
  const [processName, setProcessName] = useState("");
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [nodes, setNodes] = useState(new DataSet());
  const [edges, setEdges] = useState(new DataSet());

  useEffect(() => {
    const container = document.getElementById("mynetwork");
    if (container) {
      const data = {
        nodes: nodes,
        edges: edges,
      };
      const options = {
        width: "800px",
        height: "600px",
      };
      setNetwork(new Network(container, data, options));
    }
  }, []);

  const createProcess = () => {
    if (!processName) {
      alert("Por favor, introduce el nombre del proceso.");
      return;
    }
    if (processes.some((p) => p.nombre === processName)) {
      alert(
        "Ya existe un proceso con ese nombre. Por favor, elige un nombre diferente."
      );
      return;
    }
    const newProcess = { pid: Date.now(), nombre: processName, estado: "new" };
    setProcesses([...processes, newProcess]);
    setSelectedProcess(newProcess.pid);
    nodes.add([
      {
        id: newProcess.pid + "new",
        label: "New\n" + processName,
        color: "blue",
      },
      { id: newProcess.pid + "ready", label: "Ready", color: "blue" },
      { id: newProcess.pid + "running", label: "Running", color: "green" },
    ]);
    edges.add([
      {
        id: newProcess.pid + "new-ready",
        from: newProcess.pid + "new",
        to: newProcess.pid + "ready",
        label: "Admitted",
      },
      {
        id: newProcess.pid + "ready-running",
        from: newProcess.pid + "ready",
        to: newProcess.pid + "running",
        label: "Scheduler Dispatch",
      },
    ]);
    network.selectNodes([newProcess.pid + "running"]);
    nodes.update({ id: newProcess.pid + "running", color: "lime" });
  };

  const killProcess = (pid) => {
    setProcesses(
      processes.map((p) => (p.pid === pid ? { ...p, estado: "terminated" } : p))
    );
    nodes.add({ id: pid + "terminated", label: "Terminated", color: "red" });
    edges.add({
      id: pid + "running-terminated",
      from: pid + "running",
      to: pid + "terminated",
      label: "Exit",
    });
    network.selectNodes([pid + "terminated"]);
    nodes.update({ id: pid + "new", color: "blue" });
    nodes.update({ id: pid + "ready", color: "blue" });
    nodes.update({ id: pid + "running", color: "blue" });
    nodes.update({ id: pid + "waiting", color: "blue" });
  };

  const stopProcess = (pid) => {
    setProcesses(
      processes.map((p) => (p.pid === pid ? { ...p, estado: "ready" } : p))
    );
    if (!nodes.get(pid + "waiting")) {
      nodes.add({ id: pid + "waiting", label: "Waiting", color: "yellow" });
      edges.add([
        {
          id: pid + "running-waiting",
          from: pid + "running",
          to: pid + "waiting",
          label: "I/O or Event Wait",
        },
        {
          id: pid + "waiting-ready",
          from: pid + "waiting",
          to: pid + "ready",
          label: "I/O or Event Completion",
        },
        {
          id: pid + "running-ready",
          from: pid + "running",
          to: pid + "ready",
          label: "Interrupt",
        },
      ]);
    }
    network.selectNodes([pid + "ready"]);
    nodes.update({ id: pid + "running", color: "blue" });
    nodes.update({ id: pid + "ready", color: "lime" });
  };

  const resumeProcess = (pid) => {
    setProcesses(
      processes.map((p) => (p.pid === pid ? { ...p, estado: "running" } : p))
    );
    if (nodes.get(pid + "waiting")) {
      nodes.remove(pid + "waiting");
      edges.remove([
        pid + "running-waiting",
        pid + "waiting-ready",
        pid + "running-ready",
      ]);
    }
    network.selectNodes([pid + "running"]);
    nodes.update({ id: pid + "ready", color: "blue" });
    nodes.update({ id: pid + "running", color: "lime" });
  };

  return (
    <div>
      <NavBar />
      <div className="container">
        <h1 className="titulo">
          Simulacion de Cambio de Estados en los Procesos
        </h1>
        <div>
          <textarea
            className="simulate"
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
          />
        </div>
        <div>
          <select
            className="simulate"
            value={selectedProcess}
            onChange={(e) => setSelectedProcess(e.target.value)}
          >
            {processes.map((process) => (
              <option key={process.pid} value={process.pid}>
                {process.nombre}
              </option>
            ))}
          </select>
        </div>
        <button onClick={createProcess} className="simulate-new">
          New
        </button>
        <button
          className="simulate-kill"
          onClick={() =>
            selectedProcess &&
            processes.find((p) => p.pid === selectedProcess).estado !==
              "terminated" &&
            killProcess(selectedProcess)
          }
        >
          Kill
        </button>
        <button
          className="simulate-stop"
          onClick={() =>
            selectedProcess &&
            processes.find((p) => p.pid === selectedProcess).estado !==
              "terminated" &&
            stopProcess(selectedProcess)
          }
        >
          Stop
        </button>
        <button
          className="simulate-resume"
          onClick={() =>
            selectedProcess &&
            processes.find((p) => p.pid === selectedProcess).estado !==
              "terminated" &&
            resumeProcess(selectedProcess)
          }
        >
          Resume
        </button>
      </div>
      <div id="mynetwork" class="img-container"></div>
    </div>
  );
};

export default SimulateProcess;
