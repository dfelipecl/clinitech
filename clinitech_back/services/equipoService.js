/**
 * SERVICIO: Equipo
 * Lógica de negocio para la gestión de equipos de cómputo
 */

const Equipo = require('../models/Equipo');

const EquipoService = {

  /**
   * Retorna todos los equipos registrados con sus propietarios.
   */
  async listarEquipos() {
    return await Equipo.obtenerTodos();
  },

  /**
   * Retorna un equipo por ID.
   * Lanza error 404 si no existe.
   */
  async obtenerEquipo(id) {
    const equipo = await Equipo.buscarPorId(id);
    if (!equipo) {
      const error = new Error('Equipo no encontrado');
      error.estado = 404;
      throw error;
    }
    return equipo;
  },

  /**
   * Registra un nuevo equipo de cómputo.
   */
  async registrarEquipo(datos) {
    return await Equipo.crear(datos);
  },

  /**
   * Actualiza los datos de un equipo.
   * Lanza error 404 si el equipo no existe.
   */
  async actualizarEquipo(id, datos) {
    const equipo = await Equipo.actualizar(id, datos);
    if (!equipo) {
      const error = new Error('Equipo no encontrado');
      error.estado = 404;
      throw error;
    }
    return equipo;
  },

  /**
   * Elimina un equipo físicamente de la base de datos.
   * Solo se permite si el equipo no tiene reparaciones activas (no entregadas).
   * Esto evita perder el historial de órdenes en curso.
   */
  async eliminarEquipo(id) {
    const equipo = await Equipo.buscarPorId(id);
    if (!equipo) {
      const error = new Error('Equipo no encontrado');
      error.estado = 404;
      throw error;
    }

    const tieneActivas = await Equipo.tieneReparacionesActivas(id);
    if (tieneActivas) {
      const error = new Error(
        'No se puede eliminar el equipo porque tiene reparaciones activas asociadas'
      );
      error.estado = 409;
      throw error;
    }

    return await Equipo.eliminar(id);
  },
};

module.exports = EquipoService;
