// =============================================
// VERIFICAR ADMINISTRADOR
// =============================================

const verificarAdmin = (
  req,
  res,
  next
) => {

  // Existe una sesión iniciada
  if (req.session.admin) {

    return next();

  }


  // No hay sesión
  return res.redirect(
    "/admin/login"
  );

};


module.exports = {
  verificarAdmin
};