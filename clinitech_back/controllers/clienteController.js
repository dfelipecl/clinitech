/**
 * CONTROLADOR: Cliente
 * Maneja las peticiones sobre clientes registrados.
 */

const ClienteService = require('../services/clienteService');

const ClienteController = {

  /**
   * GET /api/clientes
   * Retorna la lista completa de clientes con sus datos de usuario.
   */
  async listar(req, res, next) {
    try {
      const clientes = await ClienteService.listarClientes();
      res.json({ ok: true, datos: clientes });
    } catch (error) {
      next(error);
    }
  },

};

module.exports = ClienteController;
