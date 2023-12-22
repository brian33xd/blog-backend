const express = require("express");
const multer = require("multer");
const ArticuloController = require("../controladores/articulo");
const Articulo = require("../models/Articulo");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/articulos");
  },
  filename: function (req, file, cb) {
    cb(null, "articulo" + Date.now() + file.originalname);
  },
});

const subidas = multer({ storage: storage });
//Rutas

router.post("/crear", ArticuloController.crear);
router.get("/articulos/:last3?", ArticuloController.conseguir);
router.get("/articulo/:id", ArticuloController.uno);
router.delete("/articulo/:id", ArticuloController.borrar);
router.put("/articulo/:id", ArticuloController.edit);
router.post(
  "/subir-image/:id",
  [subidas.single("file0")],
  ArticuloController.subir
);
router.get("/imagen/:fichero", ArticuloController.image);
router.get("/buscar/:busqueda", ArticuloController.busqueda);

module.exports = router;
