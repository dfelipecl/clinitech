/**
 * CONTROLADOR: Equipo
 * Maneja las peticiones sobre equipos de cómputo
 */

const EquipoService = require('../services/equipoService');

const EquipoController = {

  /**
   * GET /api/equipos
   */
  async listar(req, res, next) {
    try {
      const equipos = await EquipoService.listarEquipos();
      res.json({ ok: true, datos: equipos });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/equipos/:id
   */
  async obtener(req, res, next) {
    try {
      const equipo = await EquipoService.obtenerEquipo(req.params.id);
      res.json({ ok: true, datos: equipo });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/equipos
   * Body: { marca, modelo, numero_serie, id_cliente }
   */
  async registrar(req, res, next) {
    try {
      const equipo = await EquipoService.registrarEquipo(req.body);
      res.status(201).json({ ok: true, mensaje: 'Equipo registrado', datos: equipo });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/equipos/:id
   * Body: { marca?, modelo?, numero_serie? }
   */
  async actualizar(req, res, next) {
    try {
      const equipo = await EquipoService.actualizarEquipo(req.params.id, req.body);
      res.json({ ok: true, mensaje: 'Equipo actualizado', datos: equipo });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/equipos/:id
   * Elimina el equipo solo si no tiene reparaciones activas
   */
  async eliminar(req, res, next) {
    try {
      await EquipoService.eliminarEquipo(req.params.id);
      res.json({ ok: true, mensaje: 'Equipo eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = EquipoController;
