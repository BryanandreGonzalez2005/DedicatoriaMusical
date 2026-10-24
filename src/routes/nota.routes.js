const express = require("express");

const router = express.Router();

const notaController =
  require("../controllers/nota.controller");

const { verificarAdmin } =
  require("../middleware/auth.middleware");

// =============================================
// TODAS LAS RUTAS REQUIEREN LOGIN ADMIN
// =============================================

router.use(verificarAdmin);


// =============================================
// LISTAR NOTAS
// =============================================

router.get(
  "/",
  notaController.mostrarNotas
);


// =============================================
// NUEVA NOTA
// =============================================

router.get(
  "/nueva",
  notaController.mostrarNuevaNota
);

router.post(
  "/nueva",
  notaController.crearNuevaNota
);


// =============================================
// EDITAR NOTA
// =============================================

router.get(
  "/:id/editar",
  notaController.mostrarEditarNota
);

router.post(
  "/:id/editar",
  notaController.actualizarNota
);


// =============================================
// ELIMINAR NOTA
// =============================================

router.post(
  "/:id/eliminar",
  notaController.eliminarNota
);


// =============================================
// EXPORTAR
// =============================================

module.exports = router;