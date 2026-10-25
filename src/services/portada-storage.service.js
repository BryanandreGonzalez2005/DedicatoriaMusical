const path = require("path");
const crypto = require("crypto");
const supabase = require("../config/supabase");

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "portadas";

function extensionDeArchivo(file) {
  const porMime = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
  };

  return porMime[file.mimetype] || path.extname(file.originalname).toLowerCase() || ".jpg";
}

async function subirPortada(file) {
  if (!file) return null;

  const nombre = `portada-${Date.now()}-${crypto.randomUUID()}${extensionDeArchivo(file)}`;
  const ruta = `canciones/${nombre}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(ruta, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "31536000",
      upsert: false
    });

  if (error) {
    throw new Error(`No se pudo subir la portada a Supabase Storage: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(ruta);

  if (!data || !data.publicUrl) {
    throw new Error("Supabase no devolvió una URL pública para la portada.");
  }

  return data.publicUrl;
}

module.exports = { subirPortada };
