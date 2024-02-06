const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose'); // Importar Mongoose

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors()); 

// Middleware de CORS solo para la ruta /upload
app.use('/upload', cors({
  origin: 'http://localhost:3000',
}));

// Conexión a MongoDB con Mongoose
mongoose.connect('mongodb://localhost:27017/DB');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', () => {
  console.log('Conexión establecida a la base de datos');

  // Definir el esquema del documento
  const imagenSchema = new mongoose.Schema({
    image: String,
    date: Date
  });

  // Definir el modelo basado en el esquema
  const Imagen = mongoose.model('Imagen', imagenSchema);

  // Endpoint para guardar la imagen y la fecha en MongoDB
  app.post('/upload', async (req, res) => {
    const { image, date } = req.body;

    try {
      // Guardar en MongoDB utilizando el modelo
      await Imagen.create({ image, date });
      console.log('Imagen y fecha guardadas en MongoDB');
      res.status(200).json({ message: 'Imagen recibida y guardada correctamente' });
    } catch (error) {
      console.error('Error al insertar en la base de datos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // Endpoint para obtener todas las imágenes con sus respectivas fechas
  app.get('/images', async (req, res) => {
    try {
      // Consultar todas las imágenes utilizando el modelo
      const imagenes = await Imagen.find();
      res.status(200).json(imagenes);
    } catch (error) {
      console.error('Error al buscar imágenes en la base de datos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
