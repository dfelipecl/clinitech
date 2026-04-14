/**
 * CONTROLADOR: Reparacion
 * Maneja las peticiones sobre reparaciones
 */

const ReparacionService = require('../services/reparacionService');

const ReparacionController = {
  /**
   * GET /api/reparaciones
   */
  async listar(req, res, next) {
    try {
      const reparaciones = await ReparacionService.listarReparaciones();
      res.json({ ok: true, datos: reparaciones });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reparaciones/:id
   */
  async obtener(req, res, next) {
    try {
      const reparacion = await ReparacionService.obtenerReparacion(req.params.id);
      res.json({ ok: true, datos: reparacion });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/reparaciones
   * Body: { diagnostico, procedimiento, costo_total, fecha_inicio, id_tecnico, id_equipo }
   */
  async registrar(req, res, next) {
    try {
      const reparacion = await ReparacionService.registrarReparacion(req.body);
      res.status(201).json({ ok: true, mensaje: 'Reparación registrada', datos: reparacion });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/reparaciones/:id/estado
   * Body: { estado, costo_total?, fecha_fin? }
   */
  async actualizarEstado(req, res, next) {
    try {
      const reparacion = await ReparacionService.actualizarEstado(req.params.id, req.body);
      res.json({ ok: true, mensaje: 'Estado actualizado', datos: reparacion });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ReparacionController;