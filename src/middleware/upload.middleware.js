const multer = require("multer");
const path = require("path");


// =============================================
// CONFIGURAR DÓNDE GUARDAR LAS PORTADAS
// =============================================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(
      null,
      path.join(
        __dirname,
        "../../public/uploads/portadas"
      )
    );

  },


  // ===========================================
  // GENERAR NOMBRE ÚNICO
  // ===========================================

  filename: function (req, file, cb) {

    const extension =
      path.extname(file.originalname)
        .toLowerCase();


    const nombreArchivo =
      `portada-${Date.now()}-${Math.round(
        Math.random() * 1E9
      )}${extension}`;


    cb(
      null,
      nombreArchivo
    );

  }

});


// =============================================
// VALIDAR TIPO DE IMAGEN
// =============================================

const filtroImagen = (
  req,
  file,
  cb
) => {

  const tiposPermitidos = [

    "image/jpeg",

    "image/png",

    "image/webp"

  ];


  if (
    tiposPermitidos.includes(
      file.mimetype
    )
  ) {

    return cb(
      null,
      true
    );

  }


  return cb(
    new Error(
      "Solo se permiten imágenes JPG, PNG o WEBP."
    ),
    false
  );

};


// =============================================
// CONFIGURAR MULTER
// =============================================

const upload = multer({

  storage: storage,

  fileFilter: filtroImagen,

  limits: {

    // Máximo 5 MB
    fileSize:
      5 * 1024 * 1024

  }

});


// =============================================
// EXPORTAR
// =============================================

module.exports = upload;