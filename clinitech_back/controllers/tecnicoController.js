/**
 * CONTROLADOR: Tecnico
 * Maneja las peticiones sobre técnicos
 */

const TecnicoService = require('../services/tecnicoService');

const TecnicoController = {

  /**
   * GET /api/tecnicos
   */
  async listar(req, res, next) {
    try {
      const tecnicos = await TecnicoService.listarTecnicos();
      res.json({ ok: true, datos: tecnicos });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/tecnicos/:id
   */
  async obtener(req, res, next) {
    try {
      const tecnico = await TecnicoService.obtenerTecnico(req.params.id);
      res.json({ ok: true, datos: tecnico });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/tecnicos/:id
   * Body: { especialidad?, estado? }
   */
  async actualizar(req, res, next) {
    try {
      const tecnico = await TecnicoService.actualizarTecnico(req.params.id, req.body);
      res.json({ ok: true, mensaje: 'Técnico actualizado', datos: tecnico });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/tecnicos/:id
   * Eliminación lógica: cambia el estado del técnico a 'inactivo'.
   * No elimina el registro para preservar el historial de reparaciones.
   */
  async desactivar(req, res, next) {
    try {
      const tecnico = await TecnicoService.desactivarTecnico(req.params.id);
      res.json({ ok: true, mensaje: 'Técnico desactivado correctamente', datos: tecnico });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/tecnicos/mis-reparaciones
   * Reparaciones del técnico autenticado
   */
  async misReparaciones(req, res, next) {
    try {
      const id_tecnico = req.usuario.id_perfil;
      const reparaciones = await TecnicoService.obtenerMisReparaciones(id_tecnico);
      res.json({ ok: true, datos: reparaciones });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = TecnicoController;
