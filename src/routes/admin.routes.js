const express = require("express");

const router = express.Router();


const adminController =
  require("../controllers/admin.controller");


const {
  verificarAdmin
} =
  require("../middleware/auth.middleware");


const upload =
  require("../middleware/upload.middleware");


// =============================================
// LOGIN
// =============================================

router.get(
  "/login",
  adminController.mostrarLogin
);


router.post(
  "/login",
  adminController.procesarLogin
);


// =============================================
// DASHBOARD
// =============================================

router.get(
  "/",
  verificarAdmin,
  adminController.mostrarDashboard
);


// =============================================
// CANCIONES
// =============================================

router.get(
  "/canciones",
  verificarAdmin,
  adminController.mostrarCanciones
);


// =============================================
// NUEVA CANCIÓN
// =============================================

router.get(
  "/canciones/nueva",
  verificarAdmin,
  adminController.mostrarNuevaCancion
);


router.post(
  "/canciones/nueva",
  verificarAdmin,
  upload.single("portada"),
  adminController.crearNuevaCancion
);

// =============================================
// EDITAR CANCIÓN
// =============================================

router.get(
  "/canciones/:id/editar",
  verificarAdmin,
  adminController.mostrarEditarCancion
);
router.post(
  "/canciones/:id/editar",
  verificarAdmin,
  upload.single("portada"),
  adminController.actualizarCancion
);
// =============================================
// ELIMINAR CANCIÓN
// =============================================

router.post(
  "/canciones/:id/eliminar",
  verificarAdmin,
  adminController.eliminarCancion
);
// =============================================
// CERRAR SESIÓN
// =============================================

router.post(
  "/logout",
  verificarAdmin,
  adminController.cerrarSesion
);


module.exports = router;