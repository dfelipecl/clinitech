/**
 * GUARD DE SESIÓN
 * Verifica que el usuario tenga sesión activa y el rol correcto
 * antes de que el panel cargue. Si no cumple, redirige al login.
 *
 * Debe ser el primer script que se ejecuta en panel-tecnico.html
 * y panel-cliente.html (cargado antes que utils.js y auth.js).
 *
 * Uso:
 *   <script src="js/guard.js" data-rol="tecnico"></script>
 *   <script src="js/guard.js" data-rol="cliente"></script>
 */

(function () {
  'use strict';

  const TOKEN_KEY  = 'clinitech_token';
  const SESSION_KEY = 'clinitech_session';

  /**
   * Lee y parsea la sesión del localStorage.
   * @returns {Object|null} Datos de sesión o null si no existe / está corrupta.
   */
  function obtenerSesion() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  /**
   * Redirige al login limpiando el storage para evitar loops.
   */
  function redirigirAlLogin() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    window.location.replace('index.html');
  }

  // ── Verificar token ────────────────────────────────────────────────────────
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    redirigirAlLogin();
    return;
  }

  // ── Verificar sesión ───────────────────────────────────────────────────────
  const sesion = obtenerSesion();
  if (!sesion) {
    redirigirAlLogin();
    return;
  }

  // ── Verificar rol ──────────────────────────────────────────────────────────
  // Detecta el rol requerido desde el atributo data-rol del propio <script>.
  // Esto evita duplicar el archivo: un solo guard.js sirve para ambos paneles.
  const scripts      = document.getElementsByTagName('script');
  const thisScript   = scripts[scripts.length - 1]; // el script que se está ejecutando
  const rolRequerido = thisScript ? thisScript.getAttribute('data-rol') : null;

  if (rolRequerido && sesion.rol !== rolRequerido) {
    // El usuario tiene sesión pero con el rol equivocado: redirigir al panel correcto.
    const destino = sesion.rol === 'tecnico' ? 'panel-tecnico.html' : 'panel-cliente.html';
    window.location.replace(destino);
  }

})();
