const { Schema, model } = require("mongoose");

const ArticuloSchema = Schema({
  titulo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  corno: {
    type: String,
    required: true,
    default: "",
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: "image.png",
  },
});

module.exports = model("Articulo", ArticuloSchema, "articulos");
