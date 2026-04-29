/**
 * MODELO: Reparacion
 * Operaciones CRUD sobre la tabla reparacion.
 * Incluye JOINs para retornar información enriquecida de cada orden.
 */

const pool = require('../config/database');

const Reparacion = {

  // ── CREATE ────────────────────────────────────────────
  /**
   * Registra una nueva orden de reparación.
   * El estado inicial siempre es 'recibido' y el costo_total inicia en 0.
   */
  async crear({ diagnostico, descripcion_problema, procedimiento = null, costo_total = 0, fecha_inicio, id_tecnico, id_equipo }) {
    const resultado = await pool.query(
      `INSERT INTO reparacion
         (diagnostico, descripcion_problema, procedimiento, estado, costo_total, fecha_inicio, id_tecnico, id_equipo)
       VALUES ($1, $2, $3, 'recibido', $4, $5, $6, $7)
       RETURNING *`,
      [diagnostico, descripcion_problema || null, procedimiento, costo_total, fecha_inicio || new Date(), id_tecnico, id_equipo]
    );
    return resultado.rows[0];
  },

  // ── READ ──────────────────────────────────────────────
  /**
   * Retorna todas las reparaciones con datos del equipo, técnico y cliente.
   */
  async obtenerTodas() {
    const resultado = await pool.query(
      `SELECT r.*,
              e.marca, e.modelo, e.numero_serie,
              c.id_cliente,
              u.nombre  AS nombre_tecnico,  u.apellido  AS apellido_tecnico,
              uc.nombre AS nombre_cliente,  uc.apellido AS apellido_cliente
       FROM reparacion r
       JOIN equipo  e  ON r.id_equipo  = e.id_equipo
       JOIN tecnico t  ON r.id_tecnico = t.id_tecnico
       JOIN usuario u  ON t.id_usuario = u.id_usuario
       JOIN cliente c  ON e.id_cliente = c.id_cliente
       JOIN usuario uc ON c.id_usuario = uc.id_usuario
       ORDER BY r.fecha_inicio DESC`
    );
    return resultado.rows;
  },

  /**
   * Busca una reparación por su ID con datos completos.
   */
  async buscarPorId(id_reparacion) {
    const resultado = await pool.query(
      `SELECT r.*,
              e.marca, e.modelo, e.numero_serie,
              c.id_cliente,
              u.nombre  AS nombre_tecnico,  u.apellido  AS apellido_tecnico,
              uc.nombre AS nombre_cliente,  uc.apellido AS apellido_cliente
       FROM reparacion r
       JOIN equipo  e  ON r.id_equipo  = e.id_equipo
       JOIN tecnico t  ON r.id_tecnico = t.id_tecnico
       JOIN usuario u  ON t.id_usuario = u.id_usuario
       JOIN cliente c  ON e.id_cliente = c.id_cliente
       JOIN usuario uc ON c.id_usuario = uc.id_usuario
       WHERE r.id_reparacion = $1`,
      [id_reparacion]
    );
    return resultado.rows[0] || null;
  },

  /**
   * Retorna todas las reparaciones asignadas a un técnico específico.
   */
  async obtenerPorTecnico(id_tecnico) {
    const resultado = await pool.query(
      `SELECT r.*,
              e.marca, e.modelo, e.numero_serie,
              c.id_cliente,
              uc.nombre AS nombre_cliente, uc.apellido AS apellido_cliente
       FROM reparacion r
       JOIN equipo  e  ON r.id_equipo  = e.id_equipo
       JOIN cliente c  ON e.id_cliente = c.id_cliente
       JOIN usuario uc ON c.id_usuario = uc.id_usuario
       WHERE r.id_tecnico = $1
       ORDER BY r.fecha_inicio DESC`,
      [id_tecnico]
    );
    return resultado.rows;
  },

  // ── UPDATE ────────────────────────────────────────────
  /**
   * Actualiza el estado, costo y/o fecha de fin de una reparación.
   * COALESCE conserva el valor actual si el campo no se envía.
   */
  async actualizarEstado(id_reparacion, { estado, costo_total, fecha_fin }) {
    const resultado = await pool.query(
      `UPDATE reparacion
       SET estado      = COALESCE($1, estado),
           costo_total = COALESCE($2, costo_total),
           fecha_fin   = COALESCE($3, fecha_fin)
       WHERE id_reparacion = $4
       RETURNING *`,
      [estado, costo_total, fecha_fin, id_reparacion]
    );
    return resultado.rows[0] || null;
  },

  // ── DELETE ────────────────────────────────────────────
  /**
   * Elimina una reparación por ID.
   * Solo se permite si el estado es 'recibido' (aún no ha sido procesada).
   * La validación de negocio ocurre en el servicio, no aquí.
   */
  async eliminar(id_reparacion) {
    const resultado = await pool.query(
      'DELETE FROM reparacion WHERE id_reparacion = $1 RETURNING id_reparacion',
      [id_reparacion]
    );
    return resultado.rows[0] || null;
  },
};

module.exports = Reparacion;
