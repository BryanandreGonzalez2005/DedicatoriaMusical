const Cancion = require("../models/cancion.model");


// =============================================
// CONVERTIR URL DE YOUTUBE A URL EMBED
// =============================================

const convertirYoutubeEmbed = (url) => {

  if (!url) {
    return null;
  }

  try {

    const parsedUrl = new URL(url);


    // -----------------------------------------
    // FORMATO:
    // https://www.youtube.com/watch?v=VIDEO_ID
    // -----------------------------------------

    if (
      parsedUrl.hostname.includes("youtube.com")
    ) {

      const videoId =
        parsedUrl.searchParams.get("v");

      if (videoId) {

        return `https://www.youtube.com/embed/${videoId}`;

      }

    }


    // -----------------------------------------
    // FORMATO:
    // https://youtu.be/VIDEO_ID
    // -----------------------------------------

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

    // Obtener canciones desde Supabase
    const canciones =
      await Cancion.obtenerCanciones();


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

      }
    );


  } catch (error) {

    console.error(
      "Error obteniendo canciones:",
      error
    );

    res
      .status(500)
      .send(
        "Error al cargar las canciones."
      );

  }

};


// =============================================
// EXPORTAR CONTROLADOR
// =============================================

module.exports = {
  mostrarInicio,
};