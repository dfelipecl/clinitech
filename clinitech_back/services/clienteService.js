/**
 * SERVICIO: Cliente
 * Lógica de negocio para la gestión de clientes.
 */

const Cliente = require('../models/Cliente');

const ClienteService = {

  /**
   * Retorna todos los clientes con sus datos de usuario.
   */
  async listarClientes() {
    return await Cliente.obtenerTodos();
  },

};

module.exports = ClienteService;
