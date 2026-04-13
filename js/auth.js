/**
 * MÓDULO DE AUTENTICACIÓN
 * Maneja el login y validación de usuarios
 */

const Auth = {
  /**
   * Inicializa el formulario de login
   */
  initLoginForm() {
    const form = document.querySelector('form');
    const passwordField = document.getElementById('password');
    const toggleButton = document.getElementById('toggle-password');
    const usuarioField = document.getElementById('usuario');

    if (!form) return;

    // Visibilidad de contraseña
    if (toggleButton && passwordField) {
      toggleButton.addEventListener('click', () => {
        this.togglePasswordVisibility(passwordField, toggleButton);
      });
    }

    // Limpia errores al escribir
    if (usuarioField) {
      usuarioField.addEventListener('input', () => {
        Utils.hideError('usuario-error');
      });
    }

    if (passwordField) {
      passwordField.addEventListener('input', () => {
        Utils.hideError('password-error');
      });
    }

    // Manejar submit del formulario
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });
  },

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(passwordField, toggleButton) {
    const isPassword = passwordField.type === 'password';
    
    passwordField.type = isPassword ? 'text' : 'password';
    toggleButton.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    
    // Cambiar ícono
    toggleButton.innerHTML = isPassword ? 
      `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
       </svg>` : 
      `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
       </svg>`;
  },

  /**
   * Maneja el proceso de login
   */
  handleLogin() {
    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value;
    let isValid = true;

    // Validar usuario (documento)
    if (!Utils.validateDocument(usuario)) {
      Utils.showError('usuario-error');
      isValid = false;
    } else {
      Utils.hideError('usuario-error');
    }

    // Validar contraseña
    if (!Utils.validatePassword(password)) {
      Utils.showError('password-error');
      isValid = false;
    } else {
      Utils.hideError('password-error');
    }

    if (isValid) {
      this.performLogin(usuario, password);
    }
  },

  /**
   * Realiza el login (simulado)
   */
  performLogin(usuario, password) {
    Utils.showButtonLoading('submit-btn', '');

    // Simular llamada al servidor
    setTimeout(() => {
      Utils.hideButtonLoading('submit-btn');

      // Guardar sesión
      const userData = {
        documento: usuario,
        loginTime: new Date().toISOString(),
        role: this.determineUserRole(usuario)
      };

      Utils.saveToStorage('userSession', userData);

      // Redirigir según el rol
      this.redirectByRole(userData.role);
    }, 1500);
  },

  /**
   * Determina el rol del usuario (simulado)
   * En producción, esto vendría del servidor
   */
  determineUserRole(usuario) {
    // Simulación: si el documento empieza con 1, es técnico
    return usuario.startsWith('1') ? 'tecnico' : 'cliente';
  },

  /**
   * Redirige al panel correspondiente según el rol
   */
  redirectByRole(role) {
    const redirectUrl = role === 'tecnico' ? 'panel-tecnico.html' : 'panel-cliente.html';
    window.location.href = redirectUrl;
  },

  /**
   * Verifica si hay una sesión activa
   */
  checkSession() {
    const session = Utils.getFromStorage('userSession');
    return session !== null;
  },

  /**
   * Obtiene los datos de la sesión actual
   */
  getSession() {
    return Utils.getFromStorage('userSession');
  },

  /**
   * Cierra la sesión actual
   */
  logout() {
    Utils.removeFromStorage('userSession');
    window.location.href = 'index.html';
  }
};

// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
  window.Auth = Auth;
  
  document.addEventListener('DOMContentLoaded', () => {
    
    // Solo inicializar en la página de login
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      Auth.initLoginForm();
    }
  });
}
