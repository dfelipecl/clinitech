/**
 * MODELO: Tecnico
 * Operaciones CRUD sobre la tabla tecnico.
 * Usa JOIN con usuario para retornar información completa.
 */

const pool = require('../config/database');

const Tecnico = {

  // ── CREATE ────────────────────────────────────────────
  /**
   * Crea un nuevo técnico vinculado a un usuario existente.
   */
  async crear({ id_usuario }) {
    const resultado = await pool.query(
      `INSERT INTO tecnico (id_usuario, estado)
       VALUES ($1, 'activo')
       RETURNING *`,
      [id_usuario]
    );
    return resultado.rows[0];
  },

  // ── READ ──────────────────────────────────────────────
  /**
   * Retorna todos los técnicos con sus datos de usuario.
   */
  async obtenerTodos() {
    const resultado = await pool.query(
      `SELECT t.id_tecnico, t.estado,
              u.id_usuario, u.nombre, u.apellido, u.documento, u.correo, u.telefono
       FROM tecnico t
       JOIN usuario u ON t.id_usuario = u.id_usuario
       ORDER BY u.apellido, u.nombre`
    );
    return resultado.rows;
  },

  /**
   * Busca un técnico por su ID con datos del usuario.
   */
  async buscarPorId(id_tecnico) {
    const resultado = await pool.query(
      `SELECT t.id_tecnico, t.estado,
              u.id_usuario, u.nombre, u.apellido, u.documento, u.correo, u.telefono
       FROM tecnico t
       JOIN usuario u ON t.id_usuario = u.id_usuario
       WHERE t.id_tecnico = $1`,
      [id_tecnico]
    );
    return resultado.rows[0] || null;
  },

  /**
   * Busca el perfil de técnico asociado a un id_usuario.
   * Usado durante el login para obtener el id_perfil del token.
   */
  async buscarPorUsuario(id_usuario) {
    const resultado = await pool.query(
      'SELECT id_tecnico FROM tecnico WHERE id_usuario = $1',
      [id_usuario]
    );
    return resultado.rows[0] || null;
  },

  // ── UPDATE ────────────────────────────────────────────
  /**
   * Actualiza la especialidad y/o el estado de un técnico.
   * COALESCE conserva el valor actual si el campo no se envía.
   */
  async actualizar(id_tecnico, { estado }) {
    const resultado = await pool.query(
      `UPDATE tecnico
       SET estado = COALESCE($1, estado)
       WHERE id_tecnico = $2
       RETURNING *`,
      [estado, id_tecnico]
    );
    return resultado.rows[0] || null;
  },

  // ── DELETE ────────────────────────────────────────────
  /**
   * Elimina lógicamente un técnico cambiando su estado a 'inactivo'.
   * No elimina el registro para preservar el historial de reparaciones.
   */
  async desactivar(id_tecnico) {
    const resultado = await pool.query(
      `UPDATE tecnico
       SET estado = 'inactivo'
       WHERE id_tecnico = $1
       RETURNING *`,
      [id_tecnico]
    );
    return resultado.rows[0] || null;
  },
};

module.exports = Tecnico;
