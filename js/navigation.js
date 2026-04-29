/**
 * MÓDULO DE NAVEGACIÓN
 * Maneja la navegación del sidebar y el toggle de menús
 */

const Navigation = {
  // Constantes
  BREAKPOINTS: {
    MOBILE: 1024  // lg breakpoint de Tailwind
  },

  // Estado
  isSidebarCollapsed: false,

  // Cache de elementos del DOM
  elements: {
    sidebar: null,
    mainContent: null,
    overlay: null,
    navigation: null,
    sidebarToggle: null,
    mobileToggle: null,
    userName: null,
    userDoc: null
  },

  /**
   * Verifica si está en vista móvil
   */
  isMobile() {
    return window.innerWidth < this.BREAKPOINTS.MOBILE;
  },

  /**
   * Inicializa la navegación del panel
   */
  init() {
    this.cacheElements();
    this.setupSidebarToggle();
    this.setupMobileMenu();
    this.setupMenuNavigation();
    this.setupLogout();
    this.loadUserInfo();
  },

  /**
   * Cachea elementos del DOM una sola vez
   */
  cacheElements() {
    this.elements.sidebar = document.getElementById('sidebar');
    this.elements.mainContent = document.getElementById('main-content');
    this.elements.overlay = document.getElementById('sidebar-overlay');
    this.elements.navigation = document.getElementById('navigation');
    this.elements.sidebarToggle = document.getElementById('sidebar-toggle');
    this.elements.mobileToggle = document.getElementById('mobile-menu-toggle');
    this.elements.userName = document.getElementById('user-name');
    this.elements.userDoc = document.getElementById('user-doc');
  },

  /**
   * Configura el toggle del sidebar (colapsar/expandir)
   */
  setupSidebarToggle() {
    const { sidebarToggle, sidebar, overlay } = this.elements;

    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        if (this.isMobile()) {
          // En móvil: abrir/cerrar sidebar completo
          sidebar.classList.toggle('-translate-x-full');
          if (overlay) {
            overlay.classList.toggle('hidden');
          }
        } else {
          // En desktop: colapsar/expandir sidebar
          this.isSidebarCollapsed = !this.isSidebarCollapsed;
          sidebar.classList.toggle('sidebar-collapsed', this.isSidebarCollapsed);
          
          // Cerrar todos los submenús cuando se colapsa
          if (this.isSidebarCollapsed) {
            this.closeAllSubmenus();
          }
          
          // Guardar preferencia
          Utils.saveToStorage('sidebarCollapsed', this.isSidebarCollapsed);
        }
      });

      // Restaurar preferencia guardada solo en desktop
      if (!this.isMobile()) {
        const savedState = Utils.getFromStorage('sidebarCollapsed');
        if (savedState === true) {
          this.isSidebarCollapsed = true;
          sidebar.classList.add('sidebar-collapsed');
        }
      }
    }
  },

  /**
   * Cierra todos los submenús
   */
  closeAllSubmenus() {
    document.querySelectorAll('.submenu').forEach(el => {
      el.style.maxHeight = '0px';
      el.classList.remove('open');
    });
    document.querySelectorAll('[aria-controls]').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
    });
  },

  /**
   * Configura el menú móvil
   */
  setupMobileMenu() {
    const { mobileToggle, sidebar, overlay } = this.elements;
    
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
        if (overlay) {
          overlay.classList.toggle('hidden');
        }
      });
    }

    // Click en overlay cierra el sidebar
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
      });
    }
  },

  /**
   * Configura la navegación de los menús usando Event Delegation
   */
  setupMenuNavigation() {
    const { navigation } = this.elements;
    
    if (!navigation) return;

    // Event Delegation — un solo listener maneja todo el menú
    navigation.addEventListener('click', (e) => {
      // Clic en enlace de submenú
      const link = e.target.closest('.submenu-link');
      if (link) {
        e.preventDefault();
        const section = link.dataset.section;
        if (section) {
          ViewManager.loadView(section);
          this.setActiveLink(link);
        }
        return;
      }

      // Clic en botón toggle de submenú
      const toggle = e.target.closest('.submenu-toggle');
      if (toggle) {
        e.preventDefault();
        const submenuName = toggle.dataset.submenu;
        if (submenuName) {
          this.toggleSubmenu(submenuName);
        }
        return;
      }

      // Clic en botón de item único (fuera del nav también)
      const singleBtn = e.target.closest('.single-item-btn');
      if (singleBtn) {
        e.preventDefault();
        const section = singleBtn.dataset.section;
        if (section) {
          ViewManager.loadView(section);
          this.setActiveButton(singleBtn);
        }
      }
    });

    // Items únicos fuera del nav (mensajes, notificaciones)
    document.addEventListener('click', (e) => {
      if (e.target.closest('#navigation')) return; // ya manejado arriba
      const button = e.target.closest('.single-item-btn');
      if (button) {
        e.preventDefault();
        const section = button.dataset.section;
        if (section) {
          ViewManager.loadView(section);
          this.setActiveButton(button);
        }
      }
    });
  },

  /**
   * Establece el enlace activo en el menú
   */
  setActiveLink(activeLink) {
    // Remover active de todos los enlaces
    document.querySelectorAll('.submenu-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Remover active de todos los botones principales
    document.querySelectorAll('.menu-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Agregar active al enlace seleccionado
    activeLink.classList.add('active');
    
    // Agregar active también al botón padre si existe
    const parentButton = activeLink.closest('.submenu')?.previousElementSibling;
    if (parentButton && parentButton.classList.contains('menu-btn')) {
      parentButton.classList.add('active');
    }
  },

  /**
   * Establece el botón activo en el menú
   */
  setActiveButton(activeButton) {
    const wasActive = activeButton.classList.contains('active');
    
    // Cerrar todos los submenús y remover estados activos
    this.closeAllSubmenus();
    document.querySelectorAll('.menu-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelectorAll('.submenu-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Si no estaba activo, activar
    if (!wasActive) {
      activeButton.classList.add('active');
    }
  },

  /**
   * Toggle de un submenú
   */
  toggleSubmenu(submenuName) {
    // Si el sidebar está colapsado en desktop, no hacer nada
    if (this.isSidebarCollapsed && !this.isMobile()) return;
    
    const submenu = document.getElementById(`submenu-${submenuName}`);
    const button = document.getElementById(`${submenuName}-btn`);
    
    if (!submenu || !button) return;

    const isOpen = submenu.classList.contains('open');
    const wasActive = button.classList.contains('active');
    
    // Cerrar todos los submenús y remover estados activos
    this.closeAllSubmenus();
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.submenu-link').forEach(s => s.classList.remove('active'));
    
    // Si no estaba abierto ni activo, abrir y activar
    if (!isOpen && !wasActive) {
      submenu.classList.add('open');
      submenu.style.maxHeight = submenu.scrollHeight + 'px';
      button.setAttribute('aria-expanded', 'true');
      button.classList.add('active');
    }
  },

  /**
   * Carga la información del usuario desde la sesión real (JWT)
   */
  loadUserInfo() {
    const session = Auth.getSession();
    if (!session) {
      Auth.logout();
      return;
    }

    const { userName, userDoc } = this.elements;

    if (userName) {
      userName.textContent = session.nombre + ' ' + session.apellido;
    }

    if (userDoc) {
      // Mostrar documento o correo según disponibilidad
      userDoc.textContent = session.correo || session.documento;
    }
  },

  /**
   * Conecta el botón de logout via event listener (sin onclick inline)
   */
  setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }
  },

  /**
   * Maneja el cierre de sesión
   */
  handleLogout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      Auth.logout();
    }
  },

  /**
   * Debounce para optimizar eventos que se disparan frecuentemente
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Funciones globales para compatibilidad con HTML existente
// NOTA: Estas se mantendrán hasta migrar completamente a data-attributes
function toggleSubmenu(submenuName) {
  Navigation.toggleSubmenu(submenuName);
}



// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
  window.Navigation = Navigation;
  window.toggleSubmenu = toggleSubmenu;
  
  document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar en los paneles
    if (window.location.pathname.includes('panel-')) {
      Navigation.init();
    }
  });
}
