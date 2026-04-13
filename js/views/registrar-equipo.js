/**
 * VISTA: Registrar Equipo
 * Script específico para el formulario de registro de equipos
 */

(function() {
  'use strict';

  // Espera a que el DOM esté listo
  const formId = 'form-registrar-equipo';

  // Inicializar botones
  FormHandler.initBackButton();
  FormHandler.initCancelButton(formId);

  // Manejar submit del formulario
  FormHandler.handleFormSubmit(formId, async (data) => {

    // Lógica para registrar equipo
    console.log('Registrando equipo:', data);

    // Validación adicional específica
    if (!data.cliente || data.cliente === '') {
      throw new Error('Por favor seleccione un cliente');
    }

    // Aquí iría la llamada al backend
    // const response = await fetch('/api/equipos', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mensaje de éxito
    FormHandler.showSuccess('Equipo registrado exitosamente');
  });

})();
