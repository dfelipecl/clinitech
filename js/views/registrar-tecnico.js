/**
 * VISTA: Registrar Técnico
 * Script específico para el formulario de registro de técnicos
 */

(function() {
  'use strict';

  // Espera a que el DOM esté listo
  const formId = 'form-registrar-tecnico';

  // Inicializar botones
  FormHandler.initBackButton();
  FormHandler.initCancelButton(formId);

  // Manejar submit del formulario
  FormHandler.handleFormSubmit(formId, async (data) => {

    // Lógica para registrar técnico
    console.log('Registrando técnico:', data);

    // Aquí iría la llamada al backend
    // const response = await fetch('/api/tecnicos', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mensaje de éxito
    FormHandler.showSuccess('Técnico registrado exitosamente');
  });

})();
