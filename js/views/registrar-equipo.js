/**
 * VISTA: Registrar Equipo
 * Carga clientes reales desde la API y conecta al endpoint POST /api/equipos
 */
(function () {
  'use strict';

  const formId = 'form-registrar-equipo';

  FormHandler.initBackButton();
  FormHandler.initCancelButton(formId);

  // ── Cargar clientes reales desde GET /api/clientes ──────────────────────
  async function cargarClientes() {
    const select = document.getElementById('equipo-cliente');
    if (!select) return;

    try {
      const data    = await API.getClientes();
      const clientes = data.datos || [];

      select.innerHTML = '';

      if (clientes.length === 0) {
        const opt = document.createElement('option');
        opt.value = ''; opt.disabled = true; opt.selected = true;
        opt.textContent = 'No hay clientes registrados aún';
        select.appendChild(opt);
      } else {
        const placeholder = document.createElement('option');
        placeholder.value = ''; placeholder.disabled = true; placeholder.selected = true;
        placeholder.textContent = 'Seleccionar cliente*';
        select.appendChild(placeholder);

        clientes.forEach((c) => {
          const opt = document.createElement('option');
          opt.value       = c.id_cliente;
          opt.textContent = `${c.nombre} ${c.apellido}`;
          select.appendChild(opt);
        });
      }
    } catch (err) {
      console.error('Error cargando clientes:', err);
      select.innerHTML = '<option value="" disabled selected>Error al cargar clientes</option>';
    }
  }

  cargarClientes();

  // ── Submit ───────────────────────────────────────────────────────────────
  FormHandler.handleFormSubmit(formId, async (data) => {
    if (!data.id_cliente || data.id_cliente === '') {
      throw new Error('Por favor seleccione un cliente');
    }

    const payload = {
      tipo:         data.tipo,
      marca:        data.marca,
      modelo:       data.modelo,
      numero_serie: data.numero_serie,
      id_cliente:   parseInt(data.id_cliente, 10),
    };

    await API.crearEquipo(payload);
    FormHandler.showSuccess('Equipo registrado exitosamente');

    // Recargar clientes por si se agregó uno nuevo
    cargarClientes();
  });
})();
