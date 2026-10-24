const supabase = require("../config/supabase");


// =============================================
// OBTENER NOTAS VISIBLES
// Página pública
// =============================================

const obtenerNotas = async () => {

  const { data, error } = await supabase
    .from("notas")
    .select("*")
    .eq("visible", true)
    .order("orden", { ascending: true });

  if (error) throw error;

  return data;
};


// =============================================
// OBTENER TODAS LAS NOTAS
// Panel administrador
// =============================================

const obtenerTodas = async () => {

  const { data, error } = await supabase
    .from("notas")
    .select("*")
    .order("orden", { ascending: true });

  if (error) throw error;

  return data;
};


// =============================================
// OBTENER UNA NOTA POR ID
// =============================================

const obtenerPorId = async (id) => {

  const { data, error } = await supabase
    .from("notas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
};


// =============================================
// CREAR NOTA
// =============================================

const crearNota = async ({
  titulo,
  contenido,
  fecha,
  orden,
  visible
}) => {

  const { data, error } = await supabase
    .from("notas")
    .insert([
      {
        titulo,
        contenido,
        fecha: fecha || null,
        orden,
        visible
      }
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
};


// =============================================
// ACTUALIZAR NOTA
// =============================================

const actualizarNota = async (
  id,
  datos
) => {

  const { data, error } = await supabase
    .from("notas")
    .update({
      ...datos,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};


// =============================================
// ELIMINAR NOTA
// =============================================

const eliminarNota = async (id) => {

  const { error } = await supabase
    .from("notas")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
};


// =============================================
// EXPORTAR
// =============================================

module.exports = {
  obtenerNotas,
  obtenerTodas,
  obtenerPorId,
  crearNota,
  actualizarNota,
  eliminarNota
};