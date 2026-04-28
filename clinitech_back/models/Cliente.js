/**
 * MODELO: Cliente
 * Operaciones CRUD sobre la tabla cliente.
 * Usa JOIN con usuario para retornar información completa.
 */

const pool = require('../config/database');

const Cliente = {

  // ── CREATE ────────────────────────────────────────────
  /**
   * Crea un nuevo cliente vinculado a un usuario existente.
   */
  async crear({ id_usuario }) {
    const resultado = await pool.query(
      `INSERT INTO cliente (id_usuario)
       VALUES ($1)
       RETURNING *`,
      [id_usuario]
    );
    return resultado.rows[0];
  },

  // ── READ ──────────────────────────────────────────────
  /**
   * Retorna todos los clientes con sus datos de usuario.
   */
  async obtenerTodos() {
    const resultado = await pool.query(
      `SELECT c.id_cliente,
              u.id_usuario, u.nombre, u.apellido, u.documento, u.correo, u.telefono
       FROM cliente c
       JOIN usuario u ON c.id_usuario = u.id_usuario
       ORDER BY u.apellido, u.nombre`
    );
    return resultado.rows;
  },

  /**
   * Busca un cliente por su ID con datos del usuario.
   */
  async buscarPorId(id_cliente) {
    const resultado = await pool.query(
      `SELECT c.id_cliente,
              u.id_usuario, u.nombre, u.apellido, u.documento, u.correo, u.telefono
       FROM cliente c
       JOIN usuario u ON c.id_usuario = u.id_usuario
       WHERE c.id_cliente = $1`,
      [id_cliente]
    );
    return resultado.rows[0] || null;
  },

  /**
   * Busca el perfil de cliente asociado a un id_usuario.
   * Usado durante el login para obtener el id_perfil del token.
   */
  async buscarPorUsuario(id_usuario) {
    const resultado = await pool.query(
      'SELECT id_cliente FROM cliente WHERE id_usuario = $1',
      [id_usuario]
    );
    return resultado.rows[0] || null;
  },

  // ── DELETE ────────────────────────────────────────────
  /**
   * Elimina un cliente por ID.
   * Fallará con error 23503 si el cliente tiene equipos registrados.
   * El errorHandler lo captura y responde con un mensaje descriptivo.
   */
  async eliminar(id_cliente) {
    const resultado = await pool.query(
      'DELETE FROM cliente WHERE id_cliente = $1 RETURNING id_cliente',
      [id_cliente]
    );
    return resultado.rows[0] || null;
  },
};

module.exports = Cliente;
