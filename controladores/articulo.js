const validator = require("validator");
const Articulo = require("../models/Articulo");
const { validar } = require("../helper/validar");
const fs = require("fs");
const path = require("path");

// Controlador de articulos

const crear = (req, res) => {
  // Recoger parametros por post a guardar
  let parametros = req.body;
  //Validar datos

  try {
    validar(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
      mensa: "está en la validación",
    });
  }
  //Crear el objeto a guardar
  const articulo = new Articulo(parametros);
  //Asignar valores a objeto basado en el modelo (manual o automatico)

  articulo
    .save()
    .then((articuloSaved) => {
      return res.status(200).json({
        status: "success",
        articulo: articuloSaved,
        mensaje: "articulo creado con exito",
        parametros,
      });
    })
    .catch((error) => {
      if (error) {
        return res.status(400).json({
          status: "error",
          mensaje: "Faltan datos por enviar",
          otro: "aca esta el error",
        });
      }
    });
};

const conseguir = (req, res) => {
  let consulta = Articulo.find({});

  if (req.params.last3) {
    consulta.limit(3);
  }

  consulta
    .then((articulos) => {
      return res.status(200).send({
        status: "success",
        articulos,
      });
    })
    .catch((error) => {
      return res.status(404).json({
        status: "error",
        mensaje: "No se encuentran articulos en la base de datos",
      });
    });
};

const uno = (req, res) => {
  //conseguir id
  let id = req.params.id;

  //Buscar el articulo
  Articulo.findById(id)
    .then((articulo) => {
      return res.status(200).json({
        status: "success",
        articulo,
      });
    })
    .catch((error, articulo) => {
      if (error || !articulo) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se ha encontrado el articulo con esa id",
        });
      }
    });
};

const borrar = (req, res) => {
  let id_articulo = req.params.id;

  Articulo.findOneAndDelete({ _id: id_articulo })
    .then((articulo) => {
      return res.status(200).json({
        status: "success",
        articulo,
        mensaje: "Articulo borrado",
      });
    })
    .catch((error, articulo) => {
      if (error || !articulo)
        return res.status(500).json({
          status: "error",
          mensaje: "No se ha encontrado el articulo",
        });
    });
};

const edit = (req, res) => {
  //Tomar el id
  let id_articulo = req.params.id;
  //Tomar los datos del body
  let parametros = req.body;
  //Validar los datos
  try {
    validar(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  //Modificar el articulo

  Articulo.findOneAndUpdate({ _id: id_articulo }, parametros, { new: true })
    .then((articuloGuardado) => {
      return res.status(200).json({
        status: "success",
        articuloGuardado,
      });
    })
    .catch((error, articulo) => {
      if (error || !articulo) {
        return res.status(500).json({
          status: "error",
          mensaje: "No se ha podido editar el articulo",
        });
      }
    });
};

const subir = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      mensaje: "Por favor introduce una imagen",
    });
  }
  let archivo = req.file.filename;

  let archivo_split = archivo.split(".");

  let extension = archivo_split[1];

  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "Introduce una imagen png, jpg, jpeg o gif",
      });
    });
  } else {
    //Tomar el id
    let id_articulo = req.params.id;

    //Modificar el articulo

    Articulo.findOneAndUpdate(
      { _id: id_articulo },
      { image: req.file.filename },
      { new: true }
    )
      .then((articuloGuardado) => {
        return res.status(200).json({
          status: "success",
          articuloGuardado,
          fichero: req.file,
        });
      })
      .catch((error, articulo) => {
        if (error || !articulo) {
          return res.status(500).json({
            status: "error",
            mensaje: "No se ha podido editar el articulo",
          });
        }
      });
  }
};

const image = (req, res) => {
  let fichero = req.params.fichero;

  let ruta_fisica = "./imagenes/articulos/" + fichero;

  fs.stat(ruta_fisica, (error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(ruta_fisica));
    } else {
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe",
        existe,
        fichero,
        ruta_fisica,
      });
    }
  });
};

const busqueda = (req, res) => {
  let busqueda = req.params.busqueda;

  //Buscar con Find
  let articulos_buscados = Articulo.find({
    $or: [
      { titulo: { $regex: busqueda, $options: "i" } },
      { description: { $regex: busqueda, $options: "i" } },
      { corno: { $regex: busqueda, $options: "i" } },
    ],
  });
  //Ordenarlos
  articulos_buscados
    .sort({ date: -1 })
    .catch((error, articulos) => {
      if (error || !articulos || articulos <= 0) {
        return res.status(404).json({
          status: "error",
          mensaje: "no se han encontrado los resultados de: " + busqueda,
        });
      }
    })
    .then((articulos, error) => {
      return res.status(200).json({
        status: "success",
        mensaje: "éstos son los resultados",
        articulos,
      });
    });
};
module.exports = {
  crear,
  conseguir,
  uno,
  borrar,
  edit,
  subir,
  image,
  busqueda,
};
