const mongoose = require("mongoose");
const mongo_URI =
  "mongodb+srv://BrianDB:brian1110011@brian33.sn9ep8h.mongodb.net/Blog";

const connection = async () => {
  try {
    await mongoose.connect(mongo_URI, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Correctly connected to database my blog");
  } catch (error) {
    console.log(error);
    throw new Error("No se ha podido conectar a la base de datos");
  }
};

module.exports = {
  connection,
};
