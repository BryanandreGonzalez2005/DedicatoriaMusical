const supabase = require("../config/supabase");


// =============================================
// OBTENER CANCIONES VISIBLES
// =============================================

const obtenerCanciones = async () => {

  const { data, error } = await supabase
    .from("canciones")
    .select("*")
    .eq("visible", true)
    .order("orden", {
      ascending: true
    });

  if (error) {
    throw error;
  }

  return data;
};


// =============================================
// OBTENER TODAS LAS CANCIONES
// =============================================

const obtenerTodas = async () => {

  const { data, error } = await supabase
    .from("canciones")
    .select("*")
    .order("orden", {
      ascending: true
    });

  if (error) {
    throw error;
  }

  return data;
};


// =============================================
// OBTENER UNA CANCIÓN POR ID
// =============================================

const obtenerPorId = async (id) => {

  const { data, error } = await supabase
    .from("canciones")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};


// =============================================
// CREAR CANCIÓN
// =============================================
const crearCancion = async ({
  titulo,
  artista,
  dedicatoria,
  url_musica,
  url_portada,
  plataforma,
  categoria,
  orden,
  destacada,
  visible
}) => {

  const { data, error } = await supabase
    .from("canciones")
    .insert([
      {
        titulo,
        artista,
        dedicatoria,
        url_musica,
        url_portada,
        plataforma,
        categoria,
        orden,
        destacada,
        visible
      }
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// =============================================
// ACTUALIZAR CANCIÓN
// =============================================

const actualizarCancion = async (
  id,
  datos
) => {

  const { data, error } = await supabase
    .from("canciones")
    .update({
      ...datos,
      updated_at:
        new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// =============================================
// ELIMINAR CANCIÓN
// =============================================

const eliminarCancion = async (id) => {

  const { error } = await supabase
    .from("canciones")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};
// =============================================
// EXPORTAR
// =============================================

module.exports = {

  obtenerCanciones,

  obtenerTodas,

  obtenerPorId,

  crearCancion,

  actualizarCancion,

  eliminarCancion

};