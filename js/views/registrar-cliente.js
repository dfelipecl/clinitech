/**
 * VISTA: Registrar Cliente
 * Conectado al endpoint POST /api/auth/registrar (rol: cliente)
 */
(function () {
  'use strict';

  const formId = 'form-registrar-cliente';

  FormHandler.initBackButton();
  FormHandler.initCancelButton(formId);

  FormHandler.handleFormSubmit(formId, async (data) => {
    // Mapear campos del formulario a los que espera el backend
    const payload = {
      nombre:   data.nombres,
      apellido: data.apellidos,
      documento: data.documento,
      correo:   data.correo,
      telefono: data.telefono,
      rol:      'cliente',
      password: data.documento, // contraseña inicial = número de documento
    };

    await API.registrar(payload);
    FormHandler.showSuccess('Cliente registrado exitosamente. Su contraseña inicial es su número de documento.');
  });
})();
