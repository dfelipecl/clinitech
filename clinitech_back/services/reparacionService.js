/**
 * SERVICIO: Reparacion
 * Lógica de negocio para la gestión de órdenes de reparación
 */

const Reparacion = require('../models/Reparacion');
const Equipo     = require('../models/Equipo');

const ReparacionService = {

  /**
   * Retorna todas las reparaciones con información enriquecida.
   */
  async listarReparaciones() {
    return await Reparacion.obtenerTodas();
  },

  /**
   * Retorna una reparación por ID.
   * Lanza error 404 si no existe.
   */
  async obtenerReparacion(id) {
    const reparacion = await Reparacion.buscarPorId(id);
    if (!reparacion) {
      const error = new Error('Reparación no encontrada');
      error.estado = 404;
      throw error;
    }
    return reparacion;
  },

  /**
   * Registra una nueva orden de reparación.
   * Verifica que el equipo exista antes de crear la orden.
   */
  async registrarReparacion(datos) {
    const equipo = await Equipo.buscarPorId(datos.id_equipo);
    if (!equipo) {
      const error = new Error('El equipo especificado no existe');
      error.estado = 404;
      throw error;
    }
    return await Reparacion.crear(datos);
  },

  /**
   * Actualiza el estado de una reparación.
   * Valida que la transición de estado sea coherente con el flujo del sistema:
   * recibido → diagnostico → en_reparacion → listo → entregado
   */
  async actualizarEstado(id, datos) {
    const estadosValidos = ['recibido', 'diagnostico', 'en_reparacion', 'listo', 'entregado'];
    if (datos.estado && !estadosValidos.includes(datos.estado)) {
      const error = new Error(`Estado inválido. Los valores permitidos son: ${estadosValidos.join(', ')}`);
      error.estado = 400;
      throw error;
    }

    const reparacion = await Reparacion.actualizarEstado(id, datos);
    if (!reparacion) {
      const error = new Error('Reparación no encontrada');
      error.estado = 404;
      throw error;
    }
    return reparacion;
  },

  /**
   * Elimina una orden de reparación.
   * Solo se permite si el estado es 'recibido' (aún no ha sido procesada).
   * Esto protege el historial de reparaciones en curso o completadas.
   */
  async eliminarReparacion(id) {
    const reparacion = await Reparacion.buscarPorId(id);
    if (!reparacion) {
      const error = new Error('Reparación no encontrada');
      error.estado = 404;
      throw error;
    }

    // Solo se puede eliminar si aún no ha comenzado el proceso
    if (reparacion.estado !== 'recibido') {
      const error = new Error(
        `No se puede eliminar una reparación en estado '${reparacion.estado}'. ` +
        'Solo se pueden eliminar órdenes en estado recibido.'
      );
      error.estado = 409;
      throw error;
    }

    return await Reparacion.eliminar(id);
  },
};

module.exports = ReparacionService;
