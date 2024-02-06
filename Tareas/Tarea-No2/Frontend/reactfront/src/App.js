import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:5000/upload', {
        image: image,
        date: currentDate,
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error sending image to server:', error);
    }
  };

  return (
    <div className="App">
      <h1>React Node Camera App</h1>
      <Webcam ref={webcamRef} />
      <br />
      <button onClick={captureImage}>Capture Image</button>
      {image && (
        <div>
          <img src={image} alt="Captured" />
          <br />
          <button onClick={sendImageToServer}>Send to Node.js</button>
        </div>
      )}
    </div>
  );
}

export default App;
