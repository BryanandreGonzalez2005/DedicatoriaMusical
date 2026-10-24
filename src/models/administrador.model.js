const supabase = require("../config/supabase");


// =============================================
// BUSCAR ADMINISTRADOR POR EMAIL
// =============================================

const buscarPorEmail = async (email) => {

  const { data, error } = await supabase
    .from("administradores")
    .select("*")
    .eq("email", email)
    .eq("activo", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};


// =============================================
// CREAR ADMINISTRADOR
// =============================================

const crearAdministrador = async ({
  nombre,
  email,
  password_hash
}) => {

  const { data, error } = await supabase
    .from("administradores")
    .insert([
      {
        nombre,
        email,
        password_hash,
        activo: true
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
// EXPORTAR
// =============================================

module.exports = {
  buscarPorEmail,
  crearAdministrador
};