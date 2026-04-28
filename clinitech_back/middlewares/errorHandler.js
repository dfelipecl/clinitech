/**
 * MIDDLEWARE: ErrorHandler
 * Captura y centraliza todos los errores del sistema con formato uniforme
 */

/**
 * Middleware de manejo de errores de Express.
 * Recibe errores lanzados con next(error) desde cualquier controlador.
 * Distingue entre errores de negocio (con código HTTP propio) y errores
 * internos del servidor, respondiendo siempre con el mismo formato JSON.
 */
const manejarError = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Error de clave duplicada en PostgreSQL (documento o correo ya existe)
  if (err.code === '23505') {
    return res.status(409).json({
      ok:      false,
      mensaje: 'Ya existe un registro con esos datos únicos',
    });
  }

  // Error de restricción de clave foránea (no se puede eliminar un registro referenciado)
  if (err.code === '23503') {
    return res.status(409).json({
      ok:      false,
      mensaje: 'No se puede eliminar el registro porque tiene datos asociados',
    });
  }

  // Error de negocio con código HTTP propio (lanzado desde los servicios)
  const estado = err.estado || 500;
  res.status(estado).json({
    ok:      false,
    mensaje: err.message || 'Error interno del servidor',
  });
};

module.exports = { manejarError };
