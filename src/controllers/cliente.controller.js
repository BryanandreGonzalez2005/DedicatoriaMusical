const Cancion = require("../models/cancion.model");
const Nota = require("../models/nota.model");


// =============================================
// CONVERTIR URL DE YOUTUBE A URL EMBED
// =============================================

const convertirYoutubeEmbed = (url) => {

  if (!url) {
    return null;
  }

  try {

    const parsedUrl = new URL(url);

    if (
      parsedUrl.hostname.includes("youtube.com")
    ) {

      const videoId =
        parsedUrl.searchParams.get("v");

      if (videoId) {

        return `https://www.youtube.com/embed/${videoId}`;

      }

    }

    if (
      parsedUrl.hostname === "youtu.be"
    ) {

      const videoId =
        parsedUrl.pathname.substring(1);

      if (videoId) {

        return `https://www.youtube.com/embed/${videoId}`;

      }

    }

    return null;

  } catch (error) {

    console.error(
      "URL de YouTube no válida:",
      url
    );

    return null;

  }

};


// =============================================
// MOSTRAR PÁGINA PRINCIPAL
// =============================================

const mostrarInicio = async (req, res) => {

  try {

    // Obtener canciones y notas desde Supabase
    const [canciones, notas] =
      await Promise.all([
        Cancion.obtenerCanciones(),
        Nota.obtenerNotas()
      ]);


    // Preparar canciones para la vista
    const cancionesPreparadas =
      canciones.map((cancion) => {

        return {

          ...cancion,

          url_embed:
            cancion.plataforma === "youtube"
              ? convertirYoutubeEmbed(
                  cancion.url_musica
                )
              : null,

        };

      });


    // Mostrar la vista
    res.render(
      "cliente/inicio",
      {

        titulo:
          "Canciones para ti ❤️",

        canciones:
          cancionesPreparadas,

        notas: notas,

      }
    );


  } catch (error) {

    console.error(
      "Error cargando la página:",
      error
    );

    res
      .status(500)
      .send(
        "Error al cargar la página."
      );

  }

};


// =============================================
// EXPORTAR CONTROLADOR
// =============================================

module.exports = {
  mostrarInicio,
};