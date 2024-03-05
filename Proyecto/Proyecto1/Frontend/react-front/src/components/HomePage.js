import React from "react";
import NavBar from "./MyNavBar";
import "../styles/HomePage.css";
import imagen from "../img/logo.png"; // Importa la imagen

const HomePage = () => {
  return (
    <div>
      <NavBar />
      <div className="container">
        <h1 className="titulo">BIENVENIDOS</h1>
        <div>
          <img
            className="container-img"
            src={imagen}
            alt="Descripción de la imagen"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
