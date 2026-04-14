/**
 * CONTROLADOR: Auth
 * Maneja las peticiones de login y registro
 */

const AuthService = require('../services/authService');

const AuthController = {
  /**
   * POST /api/auth/login
   * Body: { documento, password }
   */
  async login(req, res, next) {
    try {
      const { documento, password } = req.body;
      const resultado = await AuthService.login(documento, password);

      res.json({
        ok: true,
        mensaje: 'Login exitoso',
        datos: resultado,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/registrar
   * Body: { nombre, apellido, documento, correo, telefono, rol, password, especialidad? }
   */
  async registrar(req, res, next) {
    try {
      const resultado = await AuthService.registrar(req.body);

      res.status(201).json({
        ok: true,
        mensaje: 'Usuario registrado exitosamente',
        datos: resultado,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/sesion
   * Retorna los datos del usuario autenticado (del token)
   */
  obtenerSesion(req, res) {
    res.json({
      ok: true,
      datos: req.usuario,
    });
  },
};

module.exports = AuthController;