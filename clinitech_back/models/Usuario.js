/**
 * MODELO: Usuario
 * Operaciones CRUD sobre la tabla usuario.
 * Es la entidad base compartida por técnicos y clientes.
 */

const pool = require('../config/database');

const Usuario = {

  // ── CREATE ────────────────────────────────────────────
  /**
   * Crea un nuevo registro en la tabla usuario.
   * Retorna el usuario creado sin exponer password_hash.
   */
  async crear({ nombre, apellido, documento, correo, telefono, rol, password_hash }) {
    const resultado = await pool.query(
      `INSERT INTO usuario (nombre, apellido, documento, correo, telefono, rol, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id_usuario, nombre, apellido, documento, correo, telefono, rol`,
      [nombre, apellido, documento, correo, telefono || null, rol, password_hash]
    );
    return resultado.rows[0];
  },

  // ── READ ──────────────────────────────────────────────
  /**
   * Busca un usuario por número de documento.
   * Incluye password_hash para verificación de credenciales.
   */
  async buscarPorDocumento(documento) {
    const resultado = await pool.query(
      'SELECT * FROM usuario WHERE documento = $1',
      [documento]
    );
    return resultado.rows[0] || null;
  },

  /**
   * Busca un usuario por ID.
   * No retorna password_hash por seguridad.
   */
  async buscarPorId(id_usuario) {
    const resultado = await pool.query(
      `SELECT id_usuario, nombre, apellido, documento, correo, telefono, rol
       FROM usuario WHERE id_usuario = $1`,
      [id_usuario]
    );
    return resultado.rows[0] || null;
  },

  /**
   * Busca un usuario por correo electrónico.
   * Usado para verificar unicidad antes de registrar.
   */
  async buscarPorCorreo(correo) {
    const resultado = await pool.query(
      'SELECT id_usuario FROM usuario WHERE correo = $1',
      [correo]
    );
    return resultado.rows[0] || null;
  },

  // ── DELETE ────────────────────────────────────────────
  /**
   * Elimina un usuario por ID.
   * Solo debe usarse si no tiene perfiles ni registros asociados.
   */
  async eliminar(id_usuario) {
    const resultado = await pool.query(
      'DELETE FROM usuario WHERE id_usuario = $1 RETURNING id_usuario',
      [id_usuario]
    );
    return resultado.rows[0] || null;
  },
};

module.exports = Usuario;
