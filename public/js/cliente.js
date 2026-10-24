let reproductores = [];
let reproductoresPorIndice = new Map();
let promesasReproductor = new Map();
let intervaloProgreso = null;

let youtubeAPILista = false;


/* =========================================================
   YOUTUBE - CARGA BAJO DEMANDA
========================================================= */

function onYouTubeIframeAPIReady() {
  youtubeAPILista = true;
}


/* =========================================================
   OBTENER ID DE YOUTUBE
========================================================= */

function obtenerVideoId(url) {

  if (!url) {
    return null;
  }

  if (url.includes("/embed/")) {
    return url
      .split("/embed/")[1]
      .split("?")[0];
  }

  try {

    const parsed = new URL(url);

    if (
      parsed.hostname.includes("youtu.be")
    ) {
      return parsed.pathname
        .replace("/", "")
        .split("?")[0];
    }

    return parsed.searchParams.get("v");

  } catch {

    return null;

  }
}


/* =========================================================
   ESPERAR API DE YOUTUBE
========================================================= */

function esperarYouTubeAPI() {

  return new Promise((resolve) => {

    if (
      youtubeAPILista &&
      typeof YT !== "undefined" &&
      YT.Player
    ) {
      resolve();
      return;
    }

    const comprobar = () => {

      if (
        typeof YT !== "undefined" &&
        YT.Player
      ) {

        youtubeAPILista = true;

        resolve();

        return;
      }

      setTimeout(comprobar, 100);
    };

    comprobar();

  });
}


/* =========================================================
   CREAR REPRODUCTOR SOLO CUANDO SE NECESITA
========================================================= */

async function obtenerOCrearReproductor(indice) {

  if (reproductoresPorIndice.has(indice)) {
    return reproductoresPorIndice.get(indice);
  }

  if (promesasReproductor.has(indice)) {
    return promesasReproductor.get(indice);
  }

  const promesa = new Promise(
    async (resolve) => {

      await esperarYouTubeAPI();

      const componente =
        obtenerComponente(indice);

      if (!componente) {
        promesasReproductor.delete(indice);
        resolve(null);
        return;
      }

      const elemento =
        componente.querySelector(
          ".youtube-player"
        );

      if (!elemento) {
        promesasReproductor.delete(indice);
        resolve(null);
        return;
      }

      const url =
        elemento.dataset.videoUrl;

      const videoId =
        obtenerVideoId(url);

      if (!videoId) {
        promesasReproductor.delete(indice);
        resolve(null);
        return;
      }

      const player =
        new YT.Player(
          elemento.id,
          {

            videoId: videoId,

            playerVars: {
              rel: 0,
              playsinline: 1,
              controls: 0,
              modestbranding: 1
            },

            events: {

              onReady: function (event) {

                reproductoresPorIndice.set(
                  indice,
                  event.target
                );

                reproductores.push(
                  event.target
                );

                actualizarDuracion(
                  indice,
                  event.target
                );

                promesasReproductor.delete(
                  indice
                );

                resolve(event.target);
              },

              onStateChange: function (event) {

                manejarEstadoYouTube(
                  indice,
                  event
                );

              }

            }

          }
        );

    }
  );

  promesasReproductor.set(
    indice,
    promesa
  );

  return promesa;
}


/* =========================================================
   PAUSAR LAS DEMÁS
========================================================= */

function pausarLosDemas(
  reproductorActual
) {

  reproductores.forEach(
    (reproductor) => {

      if (
        reproductor !== reproductorActual &&
        typeof reproductor.pauseVideo ===
          "function"
      ) {

        reproductor.pauseVideo();

      }

    }
  );
}


/* =========================================================
   ESTADO DEL REPRODUCTOR
========================================================= */

function manejarEstadoYouTube(
  indice,
  event
) {

  const componente =
    obtenerComponente(indice);

  if (!componente) {
    return;
  }

  if (
    event.data ===
    YT.PlayerState.PLAYING
  ) {

    pausarLosDemas(event.target);

    document
      .querySelectorAll(".music-player")
      .forEach((otro) => {

        if (otro !== componente) {

          otro.classList.remove(
            "is-playing"
          );

        }

      });

    componente.classList.add(
      "is-playing"
    );

    iniciarActualizacionProgreso(
      indice,
      event.target
    );

  }

  if (
    event.data ===
      YT.PlayerState.PAUSED ||
    event.data ===
      YT.PlayerState.ENDED
  ) {

    componente.classList.remove(
      "is-playing"
    );

    if (
      event.data ===
      YT.PlayerState.ENDED
    ) {

      actualizarBarra(
        componente,
        0,
        0
      );

    }

  }

}


/* =========================================================
   OBTENER COMPONENTE
========================================================= */

function obtenerComponente(indice) {

  return document.querySelector(
    `.music-player[data-player-index="${indice}"]`
  );

}


/* =========================================================
   DURACIÓN
========================================================= */

function actualizarDuracion(
  indice,
  player
) {

  const componente =
    obtenerComponente(indice);

  if (!componente) {
    return;
  }

  let intentos = 0;

  const intentar = () => {

    intentos++;

    const duracion =
      Number(
        player.getDuration?.() || 0
      );

    if (duracion > 0) {

      const durationLabel =
        componente.querySelector(
          ".duration-time"
        );

      if (durationLabel) {

        durationLabel.textContent =
          formatearTiempo(duracion);

      }

      return;
    }

    if (intentos < 20) {
      setTimeout(intentar, 500);
    }

  };

  intentar();

}


/* =========================================================
   PROGRESO
========================================================= */

function iniciarActualizacionProgreso(
  indice,
  player
) {

  if (intervaloProgreso) {
    clearInterval(intervaloProgreso);
  }

  intervaloProgreso =
    setInterval(() => {

      const componente =
        obtenerComponente(indice);

      if (!componente) {
        return;
      }

      const actual =
        Number(
          player.getCurrentTime?.() || 0
        );

      const duracion =
        Number(
          player.getDuration?.() || 0
        );

      actualizarBarra(
        componente,
        actual,
        duracion
      );

    }, 750);

}


/* =========================================================
   ACTUALIZAR BARRA
========================================================= */

function actualizarBarra(
  componente,
  actual,
  duracion
) {

  const barra =
    componente.querySelector(
      ".music-progress"
    );

  const actualLabel =
    componente.querySelector(
      ".current-time"
    );

  const durationLabel =
    componente.querySelector(
      ".duration-time"
    );

  const porcentaje =
    duracion > 0
      ? (actual / duracion) * 100
      : 0;

  if (barra) {

    barra.value =
      Math.min(
        100,
        Math.max(
          0,
          porcentaje
        )
      );

    barra.style.setProperty(
      "--progress",
      `${barra.value}%`
    );

  }

  if (actualLabel) {

    actualLabel.textContent =
      formatearTiempo(actual);

  }

  if (
    durationLabel &&
    duracion > 0
  ) {

    durationLabel.textContent =
      formatearTiempo(duracion);

  }

}


/* =========================================================
   FORMATEAR TIEMPO
========================================================= */

function formatearTiempo(segundos) {

  if (
    !Number.isFinite(segundos) ||
    segundos < 0
  ) {

    return "0:00";

  }

  const minutos =
    Math.floor(segundos / 60);

  const resto =
    Math.floor(segundos % 60);

  return (
    minutos +
    ":" +
    String(resto).padStart(2, "0")
  );

}


/* =========================================================
   CONTROLES DEL REPRODUCTOR
========================================================= */

function configurarReproductores() {

  document
    .querySelectorAll(".music-player")
    .forEach((componente) => {

      const indice =
        Number(
          componente.dataset.playerIndex
        );

      const botonPlay =
        componente.querySelector(
          ".music-play"
        );

      const botonAnterior =
        componente.querySelector(
          ".music-prev"
        );

      const botonSiguiente =
        componente.querySelector(
          ".music-next"
        );

      const barra =
        componente.querySelector(
          ".music-progress"
        );


      /* PLAY / PAUSE */

      botonPlay?.addEventListener(
        "click",
        async () => {

          botonPlay.disabled = true;

          try {

            const player =
              await obtenerOCrearReproductor(
                indice
              );

            if (!player) {
              return;
            }

            const estado =
              player.getPlayerState?.();

            if (
              estado ===
              YT.PlayerState.PLAYING
            ) {

              player.pauseVideo();

            } else {

              pausarLosDemas(player);

              player.playVideo();

            }

          } catch (error) {

            console.error(
              "Error cargando canción:",
              error
            );

          } finally {

            botonPlay.disabled = false;

          }

        }
      );


      /* CAMBIO VISUAL DE BARRA */

      barra?.addEventListener(
        "input",
        () => {

          barra.style.setProperty(
            "--progress",
            `${barra.value}%`
          );

        }
      );


      /* BUSCAR POSICIÓN */

      barra?.addEventListener(
        "change",
        async () => {

          const player =
            await obtenerOCrearReproductor(
              indice
            );

          if (!player) {
            return;
          }

          const duracion =
            Number(
              player.getDuration?.() || 0
            );

          if (duracion <= 0) {
            return;
          }

          const destino =
            duracion *
            (
              Number(barra.value) /
              100
            );

          player.seekTo(
            destino,
            true
          );

        }
      );


      /* ANTERIOR */

      botonAnterior?.addEventListener(
        "click",
        () => {

          reproducirVecino(
            indice,
            -1
          );

        }
      );


      /* SIGUIENTE */

      botonSiguiente?.addEventListener(
        "click",
        () => {

          reproducirVecino(
            indice,
            1
          );

        }
      );

    });

}


/* =========================================================
   CANCIÓN ANTERIOR / SIGUIENTE
========================================================= */

async function reproducirVecino(
  indiceActual,
  direccion
) {

  const componentes =
    Array.from(
      document.querySelectorAll(
        ".contenedor-cancion:not(.oculta) .music-player"
      )
    );

  const indices =
    componentes
      .map(
        (elemento) =>
          Number(
            elemento.dataset.playerIndex
          )
      )
      .filter(
        (indice) =>
          !Number.isNaN(indice)
      );

  if (indices.length === 0) {
    return;
  }

  let posicion =
    indices.indexOf(indiceActual);

  if (posicion === -1) {
    posicion = 0;
  }

  const nuevaPosicion =
    (
      posicion +
      direccion +
      indices.length
    ) %
    indices.length;

  const nuevoIndice =
    indices[nuevaPosicion];

  const player =
    await obtenerOCrearReproductor(
      nuevoIndice
    );

  if (!player) {
    return;
  }

  pausarLosDemas(player);

  player.playVideo();

  const componente =
    obtenerComponente(
      nuevoIndice
    );

  componente
    ?.closest(".contenedor-cancion")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
}

/* =========================================================
   INTERFAZ
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {
    configurarReproductores();

    const botonAbrirCarta =
      document.getElementById(
        "btnAbrirCarta"
      );

    const botonVolverArriba =
      document.getElementById(
        "btnVolverArriba"
      );


    if (botonAbrirCarta) {
      botonAbrirCarta.addEventListener(
        "click",
        function () {
          if (
            typeof Swal === "undefined"
          ) {
            console.error(
              "SweetAlert2 no está cargado."
            );
            return;
          }

          Swal.fire({
            title: "Para ti",

            html: `
              <div class="carta-contenido">
                <div class="carta-linea"></div>

                <p class="carta-texto">
                  Hay personas que llegan a nuestra vida
                  y, sin hacer demasiado ruido,
                  terminan convirtiéndose en una parte
                  muy bonita de ella.
                  <br><br>

                  Quise hacer este pequeño espacio
                  para guardar canciones que dicen
                  algunas de esas cosas que a veces
                  no sé cómo explicar con palabras.
                  <br><br>

                  Cada canción de aquí tiene
                  un pedacito de lo que quiero decirte.
                </p>
              </div>
            `,

            showCloseButton: true,
            showConfirmButton: true,
            confirmButtonText: "Cerrar",
            buttonsStyling: false,

            customClass: {
              popup: "swal-carta",
              title: "swal-titulo-carta",
              htmlContainer:
                "swal-contenido-carta",
              confirmButton:
                "swal-boton-cerrar"
            }
          });
        }
      );
    }


    if (botonVolverArriba) {
      const controlarBotonVolver =
        () => {
          botonVolverArriba
            .classList.toggle(
              "visible",
              window.scrollY > 450
            );
        };

      window.addEventListener(
        "scroll",
        controlarBotonVolver,
        { passive: true }
      );

      controlarBotonVolver();

      botonVolverArriba
        .addEventListener(
          "click",
          () => {
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }
        );
    }
  }
);
/* =========================================================
   FILTRO DE CATEGORÍAS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const botonesCategoria =
    document.querySelectorAll(".filtro-categoria");

  const cancionesCategoria =
    document.querySelectorAll(".contenedor-cancion");


  if (
    botonesCategoria.length === 0 ||
    cancionesCategoria.length === 0
  ) {
    return;
  }


  botonesCategoria.forEach((boton) => {

    boton.addEventListener("click", function () {

      const categoriaSeleccionada =
        boton.dataset.categoria;


      /* Quitar selección anterior */

      botonesCategoria.forEach((otroBoton) => {
        otroBoton.classList.remove("active");
      });


      /* Activar botón seleccionado */

      boton.classList.add("active");


      /* Mostrar u ocultar canciones */

      cancionesCategoria.forEach((contenedor) => {

        const categoriaCancion =
          contenedor.dataset.categoria;


        const mostrar =
          categoriaSeleccionada === "todas" ||
          categoriaCancion === categoriaSeleccionada;


        if (mostrar) {

          contenedor.classList.remove("oculta");

        } else {

          contenedor.classList.add("oculta");


          /*
            Si la canción que ocultamos estaba sonando,
            la pausamos.
          */

          const componente =
            contenedor.querySelector(".music-player");

          if (componente) {

            const indice =
              Number(componente.dataset.playerIndex);

            const player =
              reproductoresPorIndice.get(indice);

            if (
              player &&
              typeof player.pauseVideo === "function"
            ) {
              player.pauseVideo();
            }
          }

        }

      });

    });

  });

});
