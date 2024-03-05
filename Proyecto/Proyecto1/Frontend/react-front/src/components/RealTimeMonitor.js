import React from "react";
import NavBar from "./MyNavBar";
import "../styles/RealTimeMonitor.css";

const RealTimeMonitor = () => {
  return (
    <div>
      <NavBar />
      <div className="container">
        <h1 className="titulo">Monitoreo en Tiempo Real</h1>
        <div></div>
      </div>
    </div>
  );
};

export default RealTimeMonitor;
