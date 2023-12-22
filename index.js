require("dotenv").config();
const { connection } = require("./database/connection");
const cors = require("cors");
const express = require("express");
const app = express();
const rutas_Articulos = require("./rutas/articulo");

//Inicializar app
console.log("Comenzando la ejecución");

//Conectar a la base de datos

connection();
//Crear servidor node

const port = process.env.PORT || 3900;

//Configurar cors
app.use(cors());

//Convertir body a objeto js

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Crear rutas

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.use("/apis", rutas_Articulos);

//Crear servidor y escuchar peticiones http

app.listen(port);
