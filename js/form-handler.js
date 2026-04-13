/**
 * FORM HANDLER
 * Maneja la lógica de todos los formularios del sistema
 */

const FormHandler = {
  
  /**
   * Maneja el botón "Regresar" de los formularios
   */
  handleBackButton() {
    // Restaurar título original
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
      titleElement.textContent = 'Panel Técnico CliniTech';
    }
    
    // Mostrar vista de bienvenida del panel
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class='p-8'>
          <div class='text-center text-gray-500 mt-56'>
            <h2 class='text-2xl font-semibold mb-2'>Bienvenido al Panel Técnico</h2>
            <p class='text-lg'>Selecciona una opción del menú lateral para comenzar</p>
          </div>
        </div>
      `;
    }
    
    // Remover estado activo de todos los botones y enlaces
    document.querySelectorAll('.menu-btn, .submenu-link').forEach(el => {
      el.classList.remove('active');
    });
    
    // Colapsar todos los submenús
    document.querySelectorAll('.submenu').forEach(submenu => {
      submenu.classList.remove('open');
      submenu.style.maxHeight = '0';
    });
    
    // Actualizar aria-expanded de los botones
    document.querySelectorAll('[aria-expanded]').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
    });
  },

  /**
   * Inicializa el botón "Regresar" en la vista actual
   */
  initBackButton() {
    const backBtn = document.querySelector('.form-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.handleBackButton();
      });
    }
  },

  /**
   * Inicializa el botón "Cancelar" en un formulario
   * @param {string} formId - ID del formulario
   */
  initCancelButton(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const cancelBtn = form.querySelector('.form-btn-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los datos ingresados.')) {
          form.reset();
        }
      });
    }
  },

  /**
   * Valida un formulario básico
   * @param {FormData} formData - Datos del formulario
   * @returns {Object} - {valid: boolean, errors: array}
   */
  validateBasicForm(formData) {
    const errors = [];
    const data = Object.fromEntries(formData);

    // Validar campos requeridos
    for (const [key, value] of Object.entries(data)) {
      if (!value || value.trim() === '') {
        errors.push(`El campo ${key} es obligatorio`);
      }
    }

    // Validar documento si existe
    if (data.documento) {
      if (!/^\d{8,10}$/.test(data.documento)) {
        errors.push('El documento debe tener entre 8 y 10 dígitos');
      }
    }

    // Validar email si existe
    if (data.correo || data.email) {
      const email = data.correo || data.email;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('El correo electrónico no es válido');
      }
    }

    // Validar teléfono si existe
    if (data.telefono) {
      if (!/^\d{7,10}$/.test(data.telefono)) {
        errors.push('El teléfono debe tener entre 7 y 10 dígitos');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Muestra errores de validación
   * @param {Array} errors - Array de mensajes de error
   */
  showErrors(errors) {
    if (typeof Utils !== 'undefined') {
      errors.forEach(error => {
        Utils.showNotification(error, 'error');
      });
    } else {
      alert(errors.join('\n'));
    }
  },

  /**
   * Muestra mensaje de éxito
   * @param {string} message - Mensaje a mostrar
   */
  showSuccess(message) {
    if (typeof Utils !== 'undefined') {
      Utils.showNotification(message, 'success');
    } else {
      alert(message);
    }
  },

  /**
   * Maneja el submit de un formulario genérico
   * @param {string} formId - ID del formulario
   * @param {Function} onSubmit - Callback al hacer submit
   */
  handleFormSubmit(formId, onSubmit) {
    const form = document.getElementById(formId);
    if (!form) {
      console.error(`Formulario ${formId} no encontrado`);
      return;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Obtener datos del formulario
      const formData = new FormData(form);
      
      // Validar
      const validation = this.validateBasicForm(formData);
      if (!validation.valid) {
        this.showErrors(validation.errors);
        return;
      }

      // Convertir a objeto
      const data = Object.fromEntries(formData);

      // Deshabilitar botón submit
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn?.textContent;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando...';
      }

      try {
        // Ejecutar callback personalizado
        if (onSubmit) {
          await onSubmit(data);
        }

        // Limpiar formulario después de éxito
        setTimeout(() => {
          form.reset();
        }, 1000);

      } catch (error) {
        console.error('Error en submit:', error);
        this.showErrors([error.message || 'Error al procesar el formulario']);
      } finally {
        // Restaurar botón
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.FormHandler = FormHandler;
}
