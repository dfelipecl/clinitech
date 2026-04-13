/**
 * UTILIDADES GENERALES
 * Funciones auxiliares reutilizables en todo el proyecto
 */

const Utils = {
  /**
   * Muestra un mensaje de error debajo de un campo
   */
  showError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.classList.remove('hidden');
    }
  },

  /**
   * Oculta un mensaje de error
   */
  hideError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.classList.add('hidden');
    }
  },

  /**
   * Valida un número de documento
   */
  validateDocument(document) {
    return document && /^\d+$/.test(document.trim());
  },

  /**
   * Valida una contraseña (mínimo 6 caracteres)
   */
  validatePassword(password) {
    return password && password.length >= 6;
  },

  /**
   * Formatea una fecha
   */
  formatDate(date, locale = 'es-CO') {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Muestra un spinner de carga en un botón
   */
  showButtonLoading(buttonId, loadingText = '') {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.disabled = true;
    button.dataset.originalText = button.innerHTML;

    // Si hay texto lo muestra junto al círculo, si no solo el círculo centrado
    const textHtml = loadingText ? `<span class="ml-2">${loadingText}</span>` : '';

    button.innerHTML = `
      <svg class="animate-spin h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>${textHtml}
    `;
  },

  /**
   * Restaura un botón después de la carga
   */
  hideButtonLoading(buttonId) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.disabled = false;
    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  },

  /**
   * Muestra una notificación temporal
   */
  showNotification(message, type = 'info', duration = 3000) {
    const colors = {
      info: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500'
    };

    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  },

  /**
   * Almacena datos en localStorage de forma segura
   */
  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
      return false;
    }
  },

  /**
   * Obtiene datos de localStorage
   */
  getFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error leyendo de localStorage:', error);
      return null;
    }
  },

  /**
   * Elimina datos de localStorage
   */
  removeFromStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error eliminando de localStorage:', error);
      return false;
    }
  },

  /**
   * Sanitiza HTML para prevenir XSS
   * Convierte caracteres especiales en entidades HTML
   */
  sanitizeHTML(str) {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  },

  /**
   * Sanitiza atributos para usar en HTML
   * Más estricto que sanitizeHTML
   */
  sanitizeAttribute(str) {
    if (!str) return '';
    return str
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  /**
   * Debounce - Retrasa la ejecución hasta que dejen de llamar la función
   * @param {Function} func - Función a ejecutar
   * @param {number} wait - Milisegundos a esperar (default: 250ms)
   */
  debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.Utils = Utils;
}
