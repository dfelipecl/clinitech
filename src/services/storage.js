/**
 * Equivalente a las funciones saveToStorage / getFromStorage / removeFromStorage de utils.js
 */

export const TOKEN_KEY   = 'clinitech_token'
export const SESSION_KEY = 'clinitech_session'

export function saveToStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); return true }
  catch { return false }
}

export function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch { return null }
}

export function removeFromStorage(key) {
  try { localStorage.removeItem(key); return true }
  catch { return false }
}
