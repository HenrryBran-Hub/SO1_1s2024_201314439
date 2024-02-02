import React, { useState } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [userData, setUserData] = useState('');
  const [timeData, setTimeData] = useState('');
  const [showData, setShowData] = useState(false);

  const fetchData = async () => {
    try {
      const userResponse = await axios.get('http://0.0.0.0:8080/data/user');
      const timeResponse = await axios.get('http://0.0.0.0:8080/data/time');
      setUserData(userResponse.data.result);
      setTimeData(timeResponse.data.result);
      setShowData(true); // Mostrar la información una vez que se recibe la respuesta
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const hideData = () => {
    setUserData('');
    setTimeData('');
    setShowData(false);
  };

  return (
    <div>
      <h1>Tarea No. 1 SO1 - 1s2024</h1>
      <button onClick={fetchData}>Mostrar Datos</button>
      <button onClick={hideData}>Ocultar Datos</button>
      {showData && (
        <>
          <div>
            <h2>/data/user</h2>
            <p>{userData}</p>
          </div>
          <div>
            <h2>/data/time</h2>
            <p>{timeData}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
