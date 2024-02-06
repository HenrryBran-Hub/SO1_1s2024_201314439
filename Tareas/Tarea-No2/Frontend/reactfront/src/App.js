import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './App.css';

function App() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  const sendImageToServer = async () => {
    try {
      const currentDate = new Date().toISOString();
      // Eliminar la parte "data:image/webp;base64," de la cadena image
      const commaIndex = image.indexOf(',');
      const base64Data = image.substring(commaIndex + 1);

      const response = await axios.post('http://localhost:5000/upload', {
        image: base64Data, // Utilizar la cadena base64 sin la metadata
        date: currentDate,
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error sending image to server:', error);
    }
  };

  return (
    <div className="App">
      <h1>Tarea No. 2 SO1 201314439</h1>
      <Webcam ref={webcamRef} />
      <br />
      <button onClick={captureImage}>Capture Image</button>
      {image && (
        <div>
          <img src={image} alt="Captured" />
          <br />
          <div style={{ textAlign: 'center' }}>
            <button className="send-button" onClick={sendImageToServer}>Send to Node.js</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
