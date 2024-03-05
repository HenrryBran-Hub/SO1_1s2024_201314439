import React from "react";
import NavBar from "./MyNavBar";
import "../styles/HistoryMonitor.css";

const HistoryMonitor = () => {
  return (
    <div>
      <NavBar />
      <div className="container">
        <h1 className="titulo">Monitoreo a lo largo del tiempo</h1>
        <div></div>
      </div>
    </div>
  );
};

export default HistoryMonitor;
