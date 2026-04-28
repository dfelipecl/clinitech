/**
 * MIDDLEWARE: Validate
 * Centraliza la respuesta de errores de express-validator
 */

const { validationResult } = require('express-validator');

/**
 * Revisa el resultado de las validaciones previas.
 * Si hay errores, responde con HTTP 400 y el detalle de cada campo.
 * Si todo está bien, llama a next() para continuar al controlador.
 */
const validar = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const listaErrores = errores.array().map(e => ({
      campo:   e.path,
      mensaje: e.msg,
    }));

    return res.status(400).json({
      ok:      false,
      mensaje: 'Datos de entrada inválidos',
      errores: listaErrores,
    });
  }

  next();
};

module.exports = { validar };
