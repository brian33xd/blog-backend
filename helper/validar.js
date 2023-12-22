const validator = require("validator");

const validar = (parametros) => {
  let validate_title = !validator.isEmpty(parametros.titulo);
  let validate_content = !validator.isEmpty(parametros.description);
  let validate_categori = !validator.isEmpty(parametros.corno);

  if (!validate_title || !validate_content || !validate_categori) {
    throw new Error("No se ha validado la información");
  }
};

module.exports = {
  validar,
};
