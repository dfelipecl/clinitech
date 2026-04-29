/**
 * MODELO: Equipo
 * Operaciones CRUD sobre la tabla equipo.
 */

const pool = require('../config/database');

const Equipo = {

  // ── CREATE ────────────────────────────────────────────
  /**
   * Registra un nuevo equipo de cómputo asociado a un cliente.
   */
  async crear({ marca, modelo, numero_serie, id_cliente }) {
    const resultado = await pool.query(
      `INSERT INTO equipo (marca, modelo, numero_serie, id_cliente)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [marca, modelo, numero_serie, id_cliente]
    );
    return resultado.rows[0];
  },

  // ── READ ──────────────────────────────────────────────
  /**
   * Retorna todos los equipos con los datos del cliente propietario.
   */
  async obtenerTodos() {
    const resultado = await pool.query(
      `SELECT e.id_equipo, e.marca, e.modelo, e.numero_serie,
              c.id_cliente,
              u.nombre, u.apellido, u.documento,
              u.nombre || ' ' || u.apellido AS nombre_cliente
       FROM equipo e
       JOIN cliente c ON e.id_cliente = c.id_cliente
       JOIN usuario u ON c.id_usuario = u.id_usuario
       ORDER BY e.id_equipo DESC`
    );
    return resultado.rows;
  },

  /**
   * Busca un equipo por su ID con datos del propietario.
   */
  async buscarPorId(id_equipo) {
    const resultado = await pool.query(
      `SELECT e.id_equipo, e.marca, e.modelo, e.numero_serie,
              c.id_cliente,
              u.nombre, u.apellido, u.documento,
              u.nombre || ' ' || u.apellido AS nombre_cliente
       FROM equipo e
       JOIN cliente c ON e.id_cliente = c.id_cliente
       JOIN usuario u ON c.id_usuario = u.id_usuario
       WHERE e.id_equipo = $1`,
      [id_equipo]
    );
    return resultado.rows[0] || null;
  },

  /**
   * Verifica si un equipo tiene reparaciones activas (no entregadas).
   * Usado antes de intentar eliminar un equipo.
   */
  async tieneReparacionesActivas(id_equipo) {
    const resultado = await pool.query(
      `SELECT COUNT(*) AS total
       FROM reparacion
       WHERE id_equipo = $1
         AND estado != 'entregado'`,
      [id_equipo]
    );
    return parseInt(resultado.rows[0].total) > 0;
  },

  // ── UPDATE ────────────────────────────────────────────
  /**
   * Actualiza los datos de un equipo.
   * COALESCE conserva el valor actual si el campo no se envía.
   */
  async actualizar(id_equipo, { marca, modelo, numero_serie }) {
    const resultado = await pool.query(
      `UPDATE equipo
       SET marca        = COALESCE($1, marca),
           modelo       = COALESCE($2, modelo),
           numero_serie = COALESCE($3, numero_serie)
       WHERE id_equipo = $4
       RETURNING *`,
      [marca, modelo, numero_serie, id_equipo]
    );
    return resultado.rows[0] || null;
  },

  // ── DELETE ────────────────────────────────────────────
  /**
   * Elimina físicamente un equipo por ID.
   * Solo debe ejecutarse después de verificar que no tiene reparaciones activas.
   */
  async eliminar(id_equipo) {
    const resultado = await pool.query(
      'DELETE FROM equipo WHERE id_equipo = $1 RETURNING id_equipo',
      [id_equipo]
    );
    return resultado.rows[0] || null;
  },
};

module.exports = Equipo;
