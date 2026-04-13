/**
 * VISTA: Registrar Cliente
 * Script específico para el formulario de registro de clientes
 */

(function() {
  'use strict';

  // Espera a que el DOM esté listo
  const formId = 'form-registrar-cliente';

  // Inicializar botones
  FormHandler.initBackButton();
  FormHandler.initCancelButton(formId);

  // Manejar submit del formulario
  FormHandler.handleFormSubmit(formId, async (data) => {

    // Lógica para registrar cliente
    console.log('Registrando cliente:', data);

    // Aquí iría la llamada al backend
    // const response = await fetch('/api/clientes', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mensaje de éxito
    FormHandler.showSuccess('Cliente registrado exitosamente');
  });

})();
