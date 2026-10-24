const Nota = require("../models/nota.model");


// =============================================
// MOSTRAR TODAS LAS NOTAS
// =============================================

const mostrarNotas = async (req, res) => {

  try {

    const notas =
      await Nota.obtenerTodas();

    return res.render(
      "admin/notas",
      {
        titulo: "Administrar notas",
        administrador: req.session.admin,
        notas
      }
    );

  } catch (error) {

    console.error(
      "Error obteniendo notas:",
      error
    );

    return res.status(500).send(
      "Error al cargar las notas."
    );

  }

};


// =============================================
// MOSTRAR FORMULARIO NUEVA NOTA
// =============================================

const mostrarNuevaNota = (req, res) => {

  return res.render(
    "admin/nueva-nota",
    {
      titulo: "Nueva nota",
      administrador: req.session.admin,
      error: null
    }
  );

};


// =============================================
// CREAR NUEVA NOTA
// =============================================

const crearNuevaNota = async (req, res) => {

  try {

    const {
      titulo,
      contenido,
      fecha,
      orden
    } = req.body;

    if (!titulo || !contenido) {

      return res.status(400).render(
        "admin/nueva-nota",
        {
          titulo: "Nueva nota",
          administrador: req.session.admin,
          error:
            "El título y el contenido son obligatorios."
        }
      );

    }

    await Nota.crearNota({

      titulo: titulo.trim(),

      contenido: contenido.trim(),

      fecha:
        fecha
          ? fecha
          : null,

      orden:
        Number(orden) || 0,

      visible:
        req.body.visible === "on"

    });

    return res.redirect(
      "/admin/notas"
    );

  } catch (error) {

    console.error(
      "Error creando nota:",
      error
    );

    return res.status(500).render(
      "admin/nueva-nota",
      {
        titulo: "Nueva nota",
        administrador: req.session.admin,
        error:
          "No se pudo guardar la nota."
      }
    );

  }

};


// =============================================
// MOSTRAR EDITAR NOTA
// =============================================

const mostrarEditarNota = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const nota =
      await Nota.obtenerPorId(id);

    if (!nota) {

      return res.status(404).send(
        "Nota no encontrada."
      );

    }

    return res.render(
      "admin/editar-nota",
      {
        titulo: "Editar nota",
        administrador: req.session.admin,
        nota,
        error: null
      }
    );

  } catch (error) {

    console.error(
      "Error obteniendo nota:",
      error
    );

    return res.status(500).send(
      "No se pudo cargar la nota."
    );

  }

};


// =============================================
// ACTUALIZAR NOTA
// =============================================

const actualizarNota = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      titulo,
      contenido,
      fecha,
      orden
    } = req.body;

    const notaActual =
      await Nota.obtenerPorId(id);

    if (!notaActual) {

      return res.status(404).send(
        "Nota no encontrada."
      );

    }

    if (!titulo || !contenido) {

      return res.status(400).render(
        "admin/editar-nota",
        {
          titulo: "Editar nota",
          administrador: req.session.admin,
          nota: notaActual,
          error:
            "El título y el contenido son obligatorios."
        }
      );

    }

    await Nota.actualizarNota(
      id,
      {

        titulo:
          titulo.trim(),

        contenido:
          contenido.trim(),

        fecha:
          fecha
            ? fecha
            : null,

        orden:
          Number(orden) || 0,

        visible:
          req.body.visible === "on"

      }
    );

    return res.redirect(
      "/admin/notas"
    );

  } catch (error) {

    console.error(
      "Error actualizando nota:",
      error
    );

    return res.status(500).send(
      "No se pudo actualizar la nota."
    );

  }

};


// =============================================
// ELIMINAR NOTA
// =============================================

const eliminarNota = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const nota =
      await Nota.obtenerPorId(id);

    if (!nota) {

      return res.status(404).send(
        "Nota no encontrada."
      );

    }

    await Nota.eliminarNota(id);

    return res.redirect(
      "/admin/notas"
    );

  } catch (error) {

    console.error(
      "Error eliminando nota:",
      error
    );

    return res.status(500).send(
      "No se pudo eliminar la nota."
    );

  }

};


// =============================================
// EXPORTAR
// =============================================

module.exports = {
  mostrarNotas,
  mostrarNuevaNota,
  crearNuevaNota,
  mostrarEditarNota,
  actualizarNota,
  eliminarNota
};