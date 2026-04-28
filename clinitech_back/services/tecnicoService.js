/**
 * SERVICIO: Tecnico
 * Lógica de negocio para la gestión de técnicos
 */

const Tecnico = require('../models/Tecnico');

const TecnicoService = {

  /**
   * Retorna la lista completa de técnicos.
   */
  async listarTecnicos() {
    return await Tecnico.obtenerTodos();
  },

  /**
   * Retorna un técnico por ID.
   * Lanza error 404 si no existe.
   */
  async obtenerTecnico(id) {
    const tecnico = await Tecnico.buscarPorId(id);
    if (!tecnico) {
      const error = new Error('Técnico no encontrado');
      error.estado = 404;
      throw error;
    }
    return tecnico;
  },

  /**
   * Actualiza la especialidad y/o el estado de un técnico.
   * Lanza error 404 si el técnico no existe.
   */
  async actualizarTecnico(id, datos) {
    const tecnico = await Tecnico.actualizar(id, datos);
    if (!tecnico) {
      const error = new Error('Técnico no encontrado');
      error.estado = 404;
      throw error;
    }
    return tecnico;
  },

  /**
   * Desactiva un técnico cambiando su estado a 'inactivo'.
   * Se usa eliminación lógica para preservar el historial de reparaciones.
   * Lanza error 404 si el técnico no existe.
   */
  async desactivarTecnico(id) {
    const tecnico = await Tecnico.desactivar(id);
    if (!tecnico) {
      const error = new Error('Técnico no encontrado');
      error.estado = 404;
      throw error;
    }
    return tecnico;
  },

  /**
   * Retorna las reparaciones asignadas al técnico autenticado.
   */
  async obtenerMisReparaciones(id_tecnico) {
    // Importación diferida para evitar dependencia circular
    const Reparacion = require('../models/Reparacion');
    return await Reparacion.obtenerPorTecnico(id_tecnico);
  },
};

module.exports = TecnicoService;
