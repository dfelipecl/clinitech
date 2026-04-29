/**
 * MÓDULO DE API
 * Cliente HTTP centralizado para todas las peticiones al backend.
 * Maneja automáticamente el token JWT y errores de sesión.
 */

const API = {
  BASE_URL: 'http://localhost:3000/api',

  /**
   * Retorna los headers necesarios para cada petición.
   * Si existe token en localStorage, lo agrega como Bearer.
   */
  getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth) {
      const token = localStorage.getItem('clinitech_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  },

  /**
   * Método base para todas las peticiones fetch.
   * @param {string} endpoint - Ruta relativa, ej: '/auth/login'
   * @param {Object} options  - Opciones de fetch
   * @param {boolean} auth    - Si requiere token Bearer
   * @returns {Promise<Object>} - Respuesta parseada del servidor
   */
  async request(endpoint, options = {}, auth = true) {
    const url = `${this.BASE_URL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        ...this.getHeaders(auth),
        ...(options.headers || {}),
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    // Si el servidor responde 401, la sesión expiró
    if (response.status === 401) {
      Auth.logout();
      throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
    }

    // Si la respuesta indica error, lanzar excepción con el mensaje del servidor
    if (!response.ok || data.ok === false) {
      throw new Error(data.mensaje || `Error ${response.status} del servidor`);
    }

    return data;
  },

  // ─── AUTH ────────────────────────────────────────────────────────────────

  /**
   * POST /api/auth/login
   */
  async login(documento, password) {
    return this.request(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ documento, password }),
      },
      false // login no requiere token
    );
  },

  /**
   * POST /api/auth/registrar
   */
  async registrar(datos) {
    return this.request(
      '/auth/registrar',
      {
        method: 'POST',
        body: JSON.stringify(datos),
      },
      false
    );
  },

  /**
   * GET /api/auth/sesion — datos del usuario autenticado
   */
  async getSesion() {
    return this.request('/auth/sesion');
  },

  // ─── TÉCNICOS ─────────────────────────────────────────────────────────────

  /**
   * GET /api/tecnicos
   */
  async getTecnicos() {
    return this.request('/tecnicos');
  },

  /**
   * GET /api/tecnicos/mis-reparaciones — reparaciones del técnico autenticado
   */
  async getMisReparaciones() {
    return this.request('/tecnicos/mis-reparaciones');
  },

  // ─── CLIENTES ────────────────────────────────────────────────────────────

  /**
   * GET /api/clientes
   */
  async getClientes() {
    return this.request('/clientes');
  },

  // ─── EQUIPOS ─────────────────────────────────────────────────────────────

  /**
   * GET /api/equipos
   */
  async getEquipos() {
    return this.request('/equipos');
  },

  /**
   * POST /api/equipos
   * @param {Object} datos - { tipo, marca, modelo, numero_serie, descripcion_problema, id_cliente }
   */
  async crearEquipo(datos) {
    return this.request('/equipos', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  // ─── REPARACIONES ────────────────────────────────────────────────────────

  /**
   * GET /api/reparaciones
   */
  async getReparaciones() {
    return this.request('/reparaciones');
  },

  /**
   * POST /api/reparaciones
   * @param {Object} datos - { id_equipo, id_tecnico, diagnostico, procedimiento, costo_estimado }
   */
  async crearReparacion(datos) {
    return this.request('/reparaciones', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  /**
   * PUT /api/reparaciones/:id/estado
   * @param {number} id
   * @param {string} estado - 'recibido' | 'en_diagnostico' | 'pendiente_aprobacion' | 'en_reparacion' | 'reparado' | 'rechazado' | 'cancelado'
   */
  async actualizarEstadoReparacion(id, estado) {
    return this.request(`/reparaciones/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    });
  },
};

if (typeof window !== 'undefined') {
  window.API = API;
}
