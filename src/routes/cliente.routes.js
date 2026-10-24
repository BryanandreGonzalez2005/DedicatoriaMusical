const express = require("express");
const router = express.Router();

const clienteController = require("../controllers/cliente.controller");

router.get("/", clienteController.mostrarInicio);

module.exports = router;
