/**
 * GESTOR DE VISTAS
 * Carga contenido dinámico desde archivos HTML externos
 */

const ViewManager = {
  currentView: null,
  viewsPath: 'views/',
  viewCache: {}, // Cache para almacenar vistas ya cargadas

  /**
   * Carga una vista desde un archivo HTML
   */
  async loadView(viewName, targetElementId = 'main-content') {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) {
      console.error(`Elemento ${targetElementId} no encontrado`);
      return;
    }

    try {
      // Determinar la ruta según el tipo de usuario
      const userRole = Auth.getSession()?.role || 'tecnico';
      
      // Mapeo de vistas a rutas (para subdirectorios)
      const viewPaths = {
        'registrar-tecnico': `registros/registrar-tecnico`,
        'registrar-cliente': `registros/registrar-cliente`,
        'registrar-equipo': `registros/registrar-equipo`,
        'documento-recepcion': `documentos/recepcion`,
        'documento-entrega': `documentos/garantia`,
        'documento-garantia': `documentos/proceso-garantia`,
        'ingresar-equipo': `reparaciones/ingreso-equipo`,
        'gestionar-reparacion': `reparaciones/gestionar-reparacion`,
        'actualizar-estado': `reparaciones/actualizar-estado`,
        'historial': `historial-reparaciones`,
        'mensajes': `mensajes`,
        'notificaciones': `notificaciones`,
        // Cliente
        'mis-servicios': `mis-servicios`
      };

      const mappedPath = viewPaths[viewName] || viewName;
      const viewPath = `${this.viewsPath}${userRole}/${mappedPath}.html`;

      // Verificar si ya está en cache
      if (this.viewCache[viewPath]) {
        console.log('📦 Cargando desde cache:', viewPath);
        targetElement.innerHTML = this.viewCache[viewPath];
        this.currentView = viewName;
        this.updatePageTitle(viewName);
        this.executeScripts(targetElement);
        this.dispatchViewLoadedEvent(viewName);
        return;
      }

      // Si no está en cache, mostrar loading y cargar
      console.log('🌐 Descargando:', viewPath);
      this.showLoading(targetElement);

      // Cargar el archivo HTML
      const response = await fetch(viewPath);
      
      if (!response.ok) {
        throw new Error(`No se pudo cargar la vista: ${viewPath}`);
      }

      const html = await response.text();

      // Si el archivo está vacío, mostrar placeholder de desarrollo
      if (!html.trim()) {
        this.showPlaceholder(targetElement, viewName);
        return;
      }

      // Guardar en cache
      this.viewCache[viewPath] = html;

      // Insertar el contenido
      targetElement.innerHTML = html;
      this.currentView = viewName;

      // Actualizar título del header
      this.updatePageTitle(viewName);

      // Ejecutar scripts si existen en la vista
      this.executeScripts(targetElement);

      // Emitir evento de vista cargada
      this.dispatchViewLoadedEvent(viewName);

    } catch (error) {
      console.error('Error cargando vista:', error);
      this.showPlaceholder(targetElement, viewName);
    }
  },

  /**
   * Muestra un indicador de carga
   */
  showLoading(targetElement) {
    targetElement.innerHTML = `
      <div class="flex items-center justify-center h-full min-h-[400px]">
        <div class="text-center">
          <div class="loading-spinner"></div>
          <p class="text-gray-600 mt-4">Cargando...</p>
        </div>
      </div>
    `;
  },

  /**
   * Muestra un placeholder cuando la vista aún no está implementada
   */
  showPlaceholder(targetElement, viewName) {
    const title = viewName
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    targetElement.innerHTML = `
      <div class="form-view">
        <!-- Barra superior con botón Regresar -->
        <div class="form-header">
          <button type="button" class="form-back-btn" aria-label="Regresar al panel principal">
            <img src="assets/icons/return.svg" alt="" aria-hidden="true">
            <span>Regresar</span>
          </button>
        </div>

        <!-- Contenedor -->
        <div class="bg-white rounded-b-3xl flex-1 relative overflow-hidden flex items-center justify-center">
          <!-- Logo marca de agua (clase reutilizable) -->
          <div class="logo-watermark">
            <img src="assets/img/Logo.png" alt="CliniTech Logo">
          </div>
          
          <!-- Contenido centrado -->
          <div class="relative z-10 text-center text-gray-500">
            <h2 class="text-2xl font-semibold mb-2">${title}</h2>
            <p class="text-lg">Funcionalidad en desarrollo</p>
            <p class="text-sm mt-4 text-gray-400">El contenido se mostrará aquí una vez implementado</p>
          </div>
        </div>
      </div>
    `;
    
    // Inicializar botón regresar después de insertar el HTML
    setTimeout(() => {
      if (typeof FormHandler !== 'undefined') {
        FormHandler.initBackButton();
      }
    }, 0);
  },

  /**
   * Actualiza el título del header según la vista
   */
  updatePageTitle(viewName) {
    const pageTitleElement = document.getElementById('page-title');
    if (!pageTitleElement) return;

    // Mapeo de nombres de vista a títulos legibles
    const titles = {
      'registrar-tecnico': 'Registrar Técnico',
      'registrar-cliente': 'Registrar Cliente',
      'registrar-equipo': 'Registrar Equipo',
      'documento-recepcion': 'Documento de Recepción',
      'documento-entrega': 'Documento de Entrega',
      'documento-garantia': 'Documento de Garantía',
      'ingresar-equipo': 'Ingresar Equipo',
      'gestionar-reparacion': 'Gestionar Reparación',
      'actualizar-estado': 'Actualizar Estado',
      'historial': 'Historial de Reparaciones',
      'mensajes': 'Mensajes',
      'notificaciones': 'Notificaciones',
      'mis-servicios': 'Mis Servicios'
    };

    const newTitle = titles[viewName] || 'Panel Técnico CliniTech';
    pageTitleElement.textContent = newTitle;
  },

  /**
   * Ejecuta scripts contenidos en la vista cargada
   */
  executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }
      
      script.parentNode.replaceChild(newScript, script);
    });
  },

  /**
   * Emite un evento cuando una vista se carga
   */
  dispatchViewLoadedEvent(viewName) {
    const event = new CustomEvent('viewLoaded', {
      detail: { viewName }
    });
    document.dispatchEvent(event);
  },

  /**
   * Regresa a la vista anterior o muestra la vista de bienvenida
   */
  goBack() {
    const targetElement = document.getElementById('main-content');
    if (!targetElement) return;

    // Mostrar vista de bienvenida
    targetElement.innerHTML = `
      <div class="p-8">
        <div class="text-center text-gray-500 mt-56">
          <h2 class="text-2xl font-semibold mb-2">Bienvenido al Panel Técnico</h2>
          <p class="text-lg">Selecciona una opción del menú lateral para comenzar</p>
        </div>
      </div>
    `;

    // Limpiar estados activos del menú
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.submenu-link').forEach(s => s.classList.remove('active'));
    
    this.currentView = null;
  },

  /**
   * Precarga vistas para mejorar la velocidad
   */
  async preloadViews(viewNames) {
    const userRole = Auth.getSession()?.role || 'cliente';
    
    const preloadPromises = viewNames.map(async (viewName) => {
      try {
        const viewPath = `${this.viewsPath}${userRole}/${viewName}.html`;
        const response = await fetch(viewPath);
        if (response.ok) {
          return await response.text();
        }
      } catch (error) {
        console.error(`Error precargando ${viewName}:`, error);
      }
      return null;
    });

    await Promise.all(preloadPromises);
  },

  /**
   * Limpia el cache de vistas
   * Útil al cerrar sesión o cambiar de usuario
   */
  clearCache() {
    this.viewCache = {};
    console.log('🗑️ Cache de vistas limpiado');
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.ViewManager = ViewManager;
}
