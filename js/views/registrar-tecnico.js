/**
 * VISTA: Registrar Técnico
 * Conectado al endpoint POST /api/auth/registrar (rol: tecnico)
 */
(function () {
  'use strict';

  const formId = 'form-registrar-tecnico';

  FormHandler.initBackButton();
  FormHandler.initCancelButton(formId);

  FormHandler.handleFormSubmit(formId, async (data) => {
    const payload = {
      nombre:    data.nombres,
      apellido:  data.apellidos,
      documento: data.documento,
      correo:    data.correo,
      telefono:  data.telefono,
      rol:       'tecnico',
      password:  data.documento, // contraseña inicial = número de documento
    };

    await API.registrar(payload);
    FormHandler.showSuccess('Técnico registrado exitosamente. Su contraseña inicial es su número de documento.');
  });
})();
