/**
 * MÓDULO DE AUTENTICACIÓN
 * Reemplaza la autenticación simulada por peticiones reales a la API.
 * Guarda el JWT y datos del usuario en localStorage.
 */

const Auth = {
  TOKEN_KEY: 'clinitech_token',
  SESSION_KEY: 'clinitech_session',

  initLoginForm() {
    const form = document.querySelector('form');
    const passwordField = document.getElementById('password');
    const toggleButton = document.getElementById('toggle-password');
    const usuarioField = document.getElementById('usuario');

    if (!form) return;

    if (toggleButton && passwordField) {
      toggleButton.addEventListener('click', () => {
        this.togglePasswordVisibility(passwordField, toggleButton);
      });
    }

    if (usuarioField) {
      usuarioField.addEventListener('input', () => Utils.hideError('usuario-error'));
    }
    if (passwordField) {
      passwordField.addEventListener('input', () => Utils.hideError('password-error'));
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });
  },

  togglePasswordVisibility(passwordField, toggleButton) {
    const isPassword = passwordField.type === 'password';
    passwordField.type = isPassword ? 'text' : 'password';
    toggleButton.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    toggleButton.innerHTML = isPassword
      ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/></svg>`
      : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`;
  },

  handleLogin() {
    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value;
    let isValid = true;

    if (!Utils.validateDocument(usuario)) {
      Utils.showError('usuario-error');
      isValid = false;
    } else {
      Utils.hideError('usuario-error');
    }

    if (!Utils.validatePassword(password)) {
      Utils.showError('password-error');
      isValid = false;
    } else {
      Utils.hideError('password-error');
    }

    if (isValid) this.performLogin(usuario, password);
  },

  async performLogin(documento, password) {
    Utils.showButtonLoading('submit-btn', '');
    try {
      const data = await API.login(documento, password);

      localStorage.setItem(this.TOKEN_KEY, data.datos.token);

      const sessionData = {
        id_usuario: data.datos.usuario.id_usuario,
        nombre:     data.datos.usuario.nombre,
        apellido:   data.datos.usuario.apellido,
        documento:  data.datos.usuario.documento,
        correo:     data.datos.usuario.correo,
        rol:        data.datos.usuario.rol,
        // El backend retorna el id del perfil como id_perfil dentro de usuario
        id_tecnico: data.datos.usuario.rol === 'tecnico' ? data.datos.usuario.id_perfil : null,
        id_cliente: data.datos.usuario.rol === 'cliente' ? data.datos.usuario.id_perfil : null,
        loginTime:  new Date().toISOString(),
      };

      Utils.saveToStorage(this.SESSION_KEY, sessionData);
      Utils.showNotification('Bienvenido, ' + sessionData.nombre + '!', 'success', 2000);

      setTimeout(() => this.redirectByRole(sessionData.rol), 800);

    } catch (error) {
      Utils.hideButtonLoading('submit-btn');
      Utils.showNotification(error.message || 'Error al iniciar sesión', 'error');
    }
  },

  redirectByRole(rol) {
    window.location.href = rol === 'tecnico' ? 'panel-tecnico.html' : 'panel-cliente.html';
  },

  checkSession() {
    return !!(localStorage.getItem(this.TOKEN_KEY) && Utils.getFromStorage(this.SESSION_KEY));
  },

  getSession() {
    return Utils.getFromStorage(this.SESSION_KEY);
  },

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    Utils.removeFromStorage(this.SESSION_KEY);
    window.location.href = 'index.html';
  },
};

if (typeof window !== 'undefined') {
  window.Auth = Auth;
  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('index.html') || path.endsWith('/') || path === '/') {
      Auth.initLoginForm();
    }
  });
}
