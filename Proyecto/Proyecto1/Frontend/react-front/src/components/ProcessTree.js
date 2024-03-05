import React from "react";
import NavBar from "./MyNavBar";
import "../styles/ProcessTree.css";

const ProcessTree = () => {
  return (
    <div>
      <NavBar />
      <div className="container">
        <h1 className="titulo">Arbol de Procesos</h1>
        <div></div>
      </div>
    </div>
  );
};

export default ProcessTree;
