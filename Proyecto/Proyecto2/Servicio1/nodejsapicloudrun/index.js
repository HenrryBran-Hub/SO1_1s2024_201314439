const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const dotenv = require("dotenv");

// Cargar variables de entorno desde .env
dotenv.config();

app.use(cors());

// Conexión a MongoDB
const uri = "mongodb://34.68.26.150:27017";
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }); // Aumentar el tiempo de espera a 5 segundos

// Recuperar los últimos 20 datos de la colección 'logs'
app.get("/logs", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("mydb");
    const collection = db.collection("logs");
    const logs = await collection
      .find()
      .sort({ $natural: -1 })
      .limit(20)
      .toArray();
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al recuperar los datos" });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 8080; // Usar el puerto de la variable de entorno o 3000 si no está definida

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
