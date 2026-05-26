import { useForm } from '../../../hooks/useForm'
import { useNotification } from '../../../hooks/useNotification'
import { registrar } from '../../../services/api'

const INITIAL = {
  nombres: '', apellidos: '', tipo_documento: 'CC',
  documento: '', telefono: '', correo: '',
}

export default function RegistrarCliente({ onBack }) {
  const { values, loading, handleChange, handleSubmit, reset } = useForm(INITIAL)
  const { notify } = useNotification()

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      nombre:    data.nombres,
      apellido:  data.apellidos,
      documento: data.documento,
      correo:    data.correo,
      telefono:  data.telefono,
      rol:       'cliente',
      password:  data.documento,
    }
    await registrar(payload)
    notify('Cliente registrado exitosamente. Su contraseña inicial es su número de documento.', 'success')
    reset()
  })

  return (
    <div className="form-view">
      <div className="form-header">
        <button type="button" className="form-back-btn" onClick={onBack} aria-label="Regresar al panel principal">
          <img src="/assets/icons/return.svg" alt="" aria-hidden="true" />
          <span>Regresar</span>
        </button>
      </div>

      <div className="form-container">
        <div className="logo-watermark">
          <img src="/assets/img/Logo.png" alt="CliniTech Logo" />
        </div>

        <h2 className="form-title">Formulario de registro de cliente</h2>

        <form className="form-body" onSubmit={onSubmit}>
          <div className="form-fields">

            {/* Nombres / Apellidos */}
            <div className="form-grid form-grid-2">
              <div>
                <label htmlFor="cli-nombres" className="sr-only">Nombres</label>
                <input id="cli-nombres" type="text" name="nombres" placeholder="Nombres*"
                  required className="form-input" value={values.nombres} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="cli-apellidos" className="sr-only">Apellidos</label>
                <input id="cli-apellidos" type="text" name="apellidos" placeholder="Apellidos*"
                  required className="form-input" value={values.apellidos} onChange={handleChange} />
              </div>
            </div>

            {/* Tipo + Número documento */}
            <div className="form-grid form-grid-3">
              <div className="md:col-span-1">
                <div className="form-select-wrapper">
                  <div className="form-select-icon left">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <label htmlFor="cli-tipo-doc" className="sr-only">Tipo de documento</label>
                  <select id="cli-tipo-doc" name="tipo_documento" required
                    className="form-select with-icon-left" value={values.tipo_documento} onChange={handleChange}>
                    <option value="CC">CC (Cédula de Ciudadanía)</option>
                    <option value="TI">TI (Tarjeta de Identidad)</option>
                    <option value="CE">CE (Cédula de Extranjería)</option>
                    <option value="PP">PP (Pasaporte)</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="cli-documento" className="sr-only">Número de documento</label>
                <input id="cli-documento" type="text" name="documento" placeholder="Documento de Identidad*"
                  required inputMode="numeric" pattern="[0-9]*" className="form-input"
                  value={values.documento} onChange={handleChange} />
              </div>
            </div>

            {/* Contacto */}
            <div className="form-section">
              <h3 className="form-section-title">Contacto</h3>
              <div className="form-grid form-grid-2">
                <div>
                  <label htmlFor="cli-telefono" className="sr-only">Teléfono</label>
                  <input id="cli-telefono" type="tel" name="telefono" placeholder="Teléfono*"
                    required className="form-input" value={values.telefono} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="cli-correo" className="sr-only">Correo electrónico</label>
                  <input id="cli-correo" type="email" name="correo" placeholder="Correo*"
                    required className="form-input" value={values.correo} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="form-btn form-btn-primary" disabled={loading}>
              {loading ? 'Registrando…' : 'Registrar'}
            </button>
            <button type="button" className="form-btn form-btn-cancel" onClick={reset}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
