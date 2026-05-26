/**
 * SERVICIO DE API
 * Equivalente al api.js original, adaptado como módulo ES.
 * El contrato con el backend no cambia.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const TOKEN_KEY = 'clinitech_token'

function getHeaders(includeAuth = true) {
  const headers = { 'Content-Type': 'application/json' }
  if (includeAuth) {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function request(endpoint, options = {}, auth = true) {
  const url = `${BASE_URL}${endpoint}`
  const config = {
    ...options,
    headers: { ...getHeaders(auth), ...(options.headers || {}) },
  }

  const response = await fetch(url, config)
  const data = await response.json()

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('clinitech_session')
    window.location.href = '/'
    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.')
  }

  if (!response.ok || data.ok === false) {
    throw new Error(data.mensaje || `Error ${response.status} del servidor`)
  }

  return data
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const login = (documento, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ documento, password }) }, false)

export const registrar = (datos) =>
  request('/auth/registrar', { method: 'POST', body: JSON.stringify(datos) }, false)

export const getSesion = () => request('/auth/sesion')

// ─── TÉCNICOS ────────────────────────────────────────────────────────────────
export const getTecnicos = () => request('/tecnicos')
export const getMisReparaciones = () => request('/tecnicos/mis-reparaciones')

// ─── CLIENTES ────────────────────────────────────────────────────────────────
export const getClientes = () => request('/clientes')

// ─── EQUIPOS ─────────────────────────────────────────────────────────────────
export const getEquipos = () => request('/equipos')
export const crearEquipo = (datos) =>
  request('/equipos', { method: 'POST', body: JSON.stringify(datos) })

// ─── REPARACIONES ────────────────────────────────────────────────────────────
export const getReparaciones = () => request('/reparaciones')
export const crearReparacion = (datos) =>
  request('/reparaciones', { method: 'POST', body: JSON.stringify(datos) })
export const actualizarEstadoReparacion = (id, estado) =>
  request(`/reparaciones/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) })
