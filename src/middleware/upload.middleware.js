const multer = require("multer");

// Las portadas se mantienen temporalmente en memoria.
// El controlador las sube a Supabase Storage, evitando depender
// del sistema de archivos efímero de Render.
const storage = multer.memoryStorage();

const filtroImagen = (req, file, cb) => {
  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (tiposPermitidos.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(
    new Error("Solo se permiten imágenes JPG, PNG o WEBP."),
    false
  );
};

const upload = multer({
  storage,
  fileFilter: filtroImagen,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = upload;
