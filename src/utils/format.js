export function formatDate(date, locale = 'es-CO') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function validateDocument(doc) {
  return doc && /^\d+$/.test(String(doc).trim())
}

export function validatePassword(password) {
  return password && password.length >= 6
}

export function debounce(func, wait = 250) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
