const bcrypt = require("bcrypt");

const Administrador =
  require("../models/administrador.model");

const Cancion =
  require("../models/cancion.model");

const { subirPortada } =
  require("../services/portada-storage.service");


// =============================================
// MOSTRAR LOGIN
// =============================================

const mostrarLogin = (req, res) => {

  if (req.session.admin) {
    return res.redirect("/admin");
  }

  res.render("admin/login", {
    titulo: "Administración",
    error: null
  });

};


// =============================================
// PROCESAR LOGIN
// =============================================

const procesarLogin = async (req, res) => {

  try {

    const { email, password } = req.body;

    const administrador =
      await Administrador.buscarPorEmail(email);


    if (!administrador) {

      return res.status(401).render(
        "admin/login",
        {
          titulo: "Administración",
          error: "Correo o contraseña incorrectos."
        }
      );

    }


    const passwordCorrecta =
      await bcrypt.compare(
        password,
        administrador.password_hash
      );


    if (!passwordCorrecta) {

      return res.status(401).render(
        "admin/login",
        {
          titulo: "Administración",
          error: "Correo o contraseña incorrectos."
        }
      );

    }


    req.session.admin = {

      id: administrador.id,

      nombre: administrador.nombre,

      email: administrador.email

    };


    return res.redirect("/admin");


  } catch (error) {

    console.error(
      "Error iniciando sesión:",
      error
    );


    return res.status(500).render(
      "admin/login",
      {
        titulo: "Administración",
        error: "Ocurrió un error al iniciar sesión."
      }
    );

  }

};


// =============================================
// MOSTRAR DASHBOARD
// =============================================

const mostrarDashboard = (req, res) => {

  res.render(
    "admin/dashboard",
    {
      titulo: "Panel de administración",

      administrador:
        req.session.admin
    }
  );

};


// =============================================
// MOSTRAR CANCIONES
// =============================================

const mostrarCanciones = async (req, res) => {

  try {

    const canciones =
      await Cancion.obtenerTodas();


    return res.render(
      "admin/canciones",
      {

        titulo:
          "Administrar canciones",

        administrador:
          req.session.admin,

        canciones:
          canciones

      }
    );


  } catch (error) {

    console.error(
      "Error obteniendo canciones:",
      error
    );


    return res.status(500).send(
      "Error al cargar las canciones."
    );

  }

};


// =============================================
// MOSTRAR FORMULARIO NUEVA CANCIÓN
// =============================================

const mostrarNuevaCancion = (req, res) => {

  return res.render(
    "admin/nueva-cancion",
    {

      titulo:
        "Nueva canción",

      administrador:
        req.session.admin,

      error:
        null

    }
  );

};


// =============================================
// CREAR NUEVA CANCIÓN
// =============================================

const crearNuevaCancion = async (req, res) => {

  try {

    const {
  titulo,
  artista,
  dedicatoria,
  url_musica,
  categoria,
  orden
} = req.body;


    // =========================================
    // VALIDACIÓN
    // =========================================

    if (
      !titulo ||
      !artista ||
      !url_musica
    ) {

      return res.status(400).render(
        "admin/nueva-cancion",
        {

          titulo:
            "Nueva canción",

          administrador:
            req.session.admin,

          error:
            "Título, artista y URL de YouTube son obligatorios."

        }
      );

    }


    // =========================================
    // OBTENER PORTADA SUBIDA
    // =========================================

    let urlPortada = null;


    if (req.file) {

      urlPortada =
        await subirPortada(req.file);

    }


    // =========================================
    // GUARDAR CANCIÓN
    // =========================================

await Cancion.crearCancion({

  titulo:
    titulo.trim(),

  artista:
    artista.trim(),

  dedicatoria:
    dedicatoria
      ? dedicatoria.trim()
      : null,

  url_musica:
    url_musica.trim(),

  url_portada:
    urlPortada,

  plataforma:
    "youtube",

  categoria:
    categoria
      ? categoria.trim()
      : "Sin categoría",

  orden:
    Number(orden) || 0,

  destacada:
    req.body.destacada === "on",

  visible:
    req.body.visible === "on"

});


    // =========================================
    // VOLVER AL LISTADO
    // =========================================

    return res.redirect(
      "/admin/canciones"
    );


  } catch (error) {

    console.error(
      "Error creando canción:",
      error
    );


    return res.status(500).render(
      "admin/nueva-cancion",
      {

        titulo:
          "Nueva canción",

        administrador:
          req.session.admin,

        error:
          "No se pudo guardar la canción."

      }
    );

  }

};


// =============================================
// CERRAR SESIÓN
// =============================================

const cerrarSesion = (req, res) => {

  req.session.destroy((error) => {

    if (error) {

      console.error(
        "Error cerrando sesión:",
        error
      );

      return res.redirect("/admin");

    }


    res.clearCookie("connect.sid");


    return res.redirect(
      "/admin/login"
    );

  });

};
// =============================================
// MOSTRAR EDITAR CANCIÓN
// =============================================

const mostrarEditarCancion = async (req, res) => {

  try {

    const { id } = req.params;

    const cancion =
      await Cancion.obtenerPorId(id);

    if (!cancion) {

      return res.status(404).send(
        "Canción no encontrada."
      );

    }

    return res.render(
      "admin/editar-cancion",
      {
        titulo:
          "Editar canción",

        administrador:
          req.session.admin,

        cancion,

        error: null
      }
    );

  } catch (error) {

    console.error(
      "Error obteniendo canción:",
      error
    );

    return res.status(500).send(
      "No se pudo cargar la canción."
    );

  }

};
// =============================================
// ACTUALIZAR CANCIÓN
// =============================================

const actualizarCancion = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

const {
  titulo,
  artista,
  dedicatoria,
  url_musica,
  categoria,
  orden
} = req.body;


    // Buscar canción actual

    const cancionActual =
      await Cancion.obtenerPorId(id);


    if (!cancionActual) {

      return res.status(404).send(
        "Canción no encontrada."
      );

    }


    // Validar campos obligatorios

    if (
      !titulo ||
      !artista ||
      !url_musica
    ) {

      return res.status(400).render(
        "admin/editar-cancion",
        {

          titulo:
            "Editar canción",

          administrador:
            req.session.admin,

          cancion:
            cancionActual,

          error:
            "Título, artista y URL de YouTube son obligatorios."

        }
      );

    }


    // =========================================
    // PORTADA
    // =========================================

    let urlPortada =
      cancionActual.url_portada;


    // Si seleccionó una imagen nueva,
    // usamos la nueva portada.

    if (req.file) {

      urlPortada =
        await subirPortada(req.file);

    }


    // =========================================
    // ACTUALIZAR EN SUPABASE
    // =========================================

    await Cancion.actualizarCancion(
      id,
      {

        titulo:
          titulo.trim(),

        artista:
          artista.trim(),

        dedicatoria:
          dedicatoria
            ? dedicatoria.trim()
            : null,

        url_musica:
          url_musica.trim(),

        url_portada:
          urlPortada,

        plataforma:
  "youtube",

categoria:
  categoria
    ? categoria.trim()
    : "Sin categoría",

orden:
  Number(orden) || 0,

        visible:
          req.body.visible === "on",

        destacada:
          req.body.destacada === "on"

      }
    );


    return res.redirect(
      "/admin/canciones"
    );


  } catch (error) {

    console.error(
      "Error actualizando canción:",
      error
    );


    return res.status(500).send(
      "No se pudo actualizar la canción."
    );

  }

};

// =============================================
// ELIMINAR CANCIÓN
// =============================================

const eliminarCancion = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const cancion =
      await Cancion.obtenerPorId(id);


    if (!cancion) {

      return res.status(404).send(
        "Canción no encontrada."
      );

    }


    await Cancion.eliminarCancion(id);


    return res.redirect(
      "/admin/canciones"
    );


  } catch (error) {

    console.error(
      "Error eliminando canción:",
      error
    );


    return res.status(500).send(
      "No se pudo eliminar la canción."
    );

  }

};
// =============================================
// EXPORTAR
// =============================================
module.exports = {
  mostrarLogin,
  procesarLogin,
  mostrarDashboard,
  mostrarCanciones,
  mostrarNuevaCancion,
  crearNuevaCancion,
  mostrarEditarCancion,
  actualizarCancion,
  eliminarCancion,
  cerrarSesion
};