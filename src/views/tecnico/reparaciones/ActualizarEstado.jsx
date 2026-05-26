import { useState, useEffect } from 'react'
import { useForm } from '../../../hooks/useForm'
import { useNotification } from '../../../hooks/useNotification'
import { getReparaciones, actualizarEstadoReparacion } from '../../../services/api'

const ESTADO_LABELS = {
  recibido:             'Recibido',
  en_diagnostico:       'En diagnóstico',
  pendiente_aprobacion: 'Pendiente de aprobación',
  en_reparacion:        'En reparación',
  reparado:             'Reparado',
  rechazado:            'Rechazado',
  cancelado:            'Cancelado',
}

const INITIAL = { id_reparacion: '', estado: '' }

export default function ActualizarEstado({ onBack }) {
  const { values, loading, handleChange, handleSubmit, reset } = useForm(INITIAL)
  const { notify } = useNotification()
  const [reparaciones, setReparaciones] = useState([])
  const [loadingReps, setLoadingReps] = useState(true)

  const cargarReparaciones = async () => {
    setLoadingReps(true)
    try {
      const data = await getReparaciones()
      setReparaciones(data.datos || [])
    } catch {
      notify('Error al cargar reparaciones', 'error')
    } finally {
      setLoadingReps(false)
    }
  }

  useEffect(() => { cargarReparaciones() }, [])

  const onSubmit = handleSubmit(async (data) => {
    if (!data.id_reparacion) throw new Error('Por favor seleccione una reparación')
    if (!data.estado) throw new Error('Por favor seleccione el nuevo estado')

    await actualizarEstadoReparacion(parseInt(data.id_reparacion, 10), data.estado)
    notify('Estado actualizado exitosamente', 'success')
    reset()
    cargarReparaciones()
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

        <h2 className="form-title">Actualizar estado de reparación</h2>

        <form className="form-body" onSubmit={onSubmit}>
          <div className="form-fields">

            {/* Reparación */}
            <div className="form-section">
              <h3 className="form-section-title">Reparación</h3>
              <div className="form-select-wrapper">
                <div className="form-select-icon left">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <label htmlFor="est-reparacion" className="sr-only">Reparación</label>
                <select id="est-reparacion" name="id_reparacion" required className="form-select with-icon-left"
                  value={values.id_reparacion} onChange={handleChange} disabled={loadingReps}>
                  <option value="" disabled>
                    {loadingReps ? 'Cargando reparaciones…' : reparaciones.length === 0 ? 'No hay reparaciones registradas' : 'Seleccionar reparación*'}
                  </option>
                  {reparaciones.map(r => (
                    <option key={r.id_reparacion} value={r.id_reparacion}>
                      #{r.id_reparacion} — {r.marca || ''} {r.modelo || ''} [{ESTADO_LABELS[r.estado] || r.estado}]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nuevo estado */}
            <div>
              <div className="form-select-wrapper">
                <div className="form-select-icon left">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <label htmlFor="est-nuevo" className="sr-only">Nuevo estado</label>
                <select id="est-nuevo" name="estado" required className="form-select with-icon-left"
                  value={values.estado} onChange={handleChange}>
                  <option value="" disabled>Nuevo estado*</option>
                  <option value="recibido">Recibido</option>
                  <option value="en_diagnostico">En Diagnóstico</option>
                  <option value="pendiente_aprobacion">Pendiente de Aprobación</option>
                  <option value="en_reparacion">En Reparación</option>
                  <option value="reparado">Reparado</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="form-btn form-btn-primary" disabled={loading || loadingReps}>
              {loading ? 'Actualizando…' : 'Actualizar Estado'}
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
