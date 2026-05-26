import { useState, useEffect } from 'react'
import { useForm } from '../../../hooks/useForm'
import { useNotification } from '../../../hooks/useNotification'
import { useAuth } from '../../../context/AuthContext'
import { getEquipos, crearReparacion, actualizarEstadoReparacion } from '../../../services/api'

const INITIAL = {
  id_equipo: '', descripcion_problema: '', diagnostico: '',
  estado_inicial: '', descripcion_estado: '',
}

export default function IngresoEquipo({ onBack }) {
  const { values, loading, handleChange, handleSubmit, reset } = useForm(INITIAL)
  const { notify } = useNotification()
  const { session } = useAuth()
  const [equipos, setEquipos] = useState([])
  const [loadingEquipos, setLoadingEquipos] = useState(true)

  const cargarEquipos = async () => {
    setLoadingEquipos(true)
    try {
      const data = await getEquipos()
      setEquipos(data.datos || [])
    } catch {
      notify('Error al cargar equipos', 'error')
    } finally {
      setLoadingEquipos(false)
    }
  }

  useEffect(() => { cargarEquipos() }, [])

  const onSubmit = handleSubmit(async (data) => {
    if (!data.id_equipo) throw new Error('Por favor seleccione un equipo')
    if (!data.descripcion_problema?.trim()) throw new Error('El motivo/problema reportado es requerido')
    if (!data.diagnostico?.trim()) throw new Error('El diagnóstico es requerido')
    if (!data.estado_inicial) throw new Error('Por favor seleccione el estado del equipo')

    const diagnosticoFinal = data.descripcion_estado?.trim()
      ? `${data.diagnostico.trim()}\n\nObservación: ${data.descripcion_estado.trim()}`
      : data.diagnostico.trim()

    const payload = {
      id_equipo:            parseInt(data.id_equipo, 10),
      id_tecnico:           session.id_tecnico,
      diagnostico:          diagnosticoFinal,
      descripcion_problema: data.descripcion_problema || null,
    }

    const resp = await crearReparacion(payload)

    if (data.estado_inicial !== 'recibido' && resp.datos?.id_reparacion) {
      await actualizarEstadoReparacion(resp.datos.id_reparacion, data.estado_inicial)
    }

    notify('Reparación registrada exitosamente', 'success')
    reset()
    cargarEquipos()
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

        <h2 className="form-title">Formulario de Ingreso a Diagnóstico/Reparación</h2>

        <form className="form-body" onSubmit={onSubmit}>
          <div className="form-fields">

            {/* Equipo */}
            <div className="form-section">
              <h3 className="form-section-title">Equipo</h3>
              <div className="form-select-wrapper">
                <div className="form-select-icon left">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <label htmlFor="rep-equipo" className="sr-only">Seleccionar equipo</label>
                <select id="rep-equipo" name="id_equipo" required className="form-select with-icon-left"
                  value={values.id_equipo} onChange={handleChange} disabled={loadingEquipos}>
                  <option value="" disabled>
                    {loadingEquipos ? 'Cargando equipos…' : equipos.length === 0 ? 'No hay equipos registrados' : 'Buscar equipo*'}
                  </option>
                  {equipos.map(eq => (
                    <option key={eq.id_equipo} value={eq.id_equipo}>
                      {eq.marca} {eq.modelo} — S/N: {eq.numero_serie}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descripción del problema */}
            <div>
              <label htmlFor="rep-desc-prob" className="form-section-title">
                Motivo/Problemas reportados por el cliente
              </label>
              <textarea id="rep-desc-prob" name="descripcion_problema" required rows={3}
                placeholder="Describa el problema tal como lo reporta el cliente*"
                className="form-input resize-none" value={values.descripcion_problema} onChange={handleChange} />
            </div>

            {/* Diagnóstico */}
            <div>
              <label htmlFor="rep-diagnostico" className="form-section-title">Diagnóstico</label>
              <textarea id="rep-diagnostico" name="diagnostico" required rows={3}
                placeholder="Diagnóstico inicial del técnico*"
                className="form-input resize-none" value={values.diagnostico} onChange={handleChange} />
            </div>

            {/* Estado */}
            <div>
              <label className="form-section-title">Estado del equipo</label>
              <div className="form-select-wrapper">
                <div className="form-select-icon left">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <label htmlFor="rep-estado" className="sr-only">Estado del equipo</label>
                <select id="rep-estado" name="estado_inicial" required className="form-select with-icon-left"
                  value={values.estado_inicial} onChange={handleChange}>
                  <option value="" disabled>Seleccione*</option>
                  <option value="en_diagnostico">En Diagnóstico</option>
                  <option value="pendiente_aprobacion">Pendiente de Aprobación</option>
                  <option value="en_reparacion">En Reparación</option>
                  <option value="rechazado">Rechazado/Cancelado</option>
                </select>
              </div>
            </div>

            {/* Descripción del estado */}
            <div>
              <label htmlFor="rep-desc-estado" className="form-section-title">Descripción del estado</label>
              <input id="rep-desc-estado" type="text" name="descripcion_estado"
                placeholder="Descripción del estado (opcional)"
                className="form-input" value={values.descripcion_estado} onChange={handleChange} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="form-btn form-btn-primary" disabled={loading || loadingEquipos}>
              {loading ? 'Ingresando…' : 'Ingresar a Reparación'}
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
