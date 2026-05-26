import { useState, useEffect } from 'react'
import { useForm } from '../../../hooks/useForm'
import { useNotification } from '../../../hooks/useNotification'
import { getClientes, crearEquipo } from '../../../services/api'

const INITIAL = { tipo: '', marca: '', modelo: '', numero_serie: '', id_cliente: '' }

export default function RegistrarEquipo({ onBack }) {
  const { values, loading, handleChange, handleSubmit, reset } = useForm(INITIAL)
  const { notify } = useNotification()
  const [clientes, setClientes] = useState([])
  const [loadingClientes, setLoadingClientes] = useState(true)

  const cargarClientes = async () => {
    setLoadingClientes(true)
    try {
      const data = await getClientes()
      setClientes(data.datos || [])
    } catch {
      notify('Error al cargar la lista de clientes', 'error')
    } finally {
      setLoadingClientes(false)
    }
  }

  useEffect(() => { cargarClientes() }, [])

  const onSubmit = handleSubmit(async (data) => {
    if (!data.id_cliente) throw new Error('Por favor seleccione un cliente')
    const payload = {
      tipo:         data.tipo,
      marca:        data.marca,
      modelo:       data.modelo,
      numero_serie: data.numero_serie,
      id_cliente:   parseInt(data.id_cliente, 10),
    }
    await crearEquipo(payload)
    notify('Equipo registrado exitosamente', 'success')
    reset()
    cargarClientes()
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

        <h2 className="form-title">Formulario de registro de equipo</h2>

        <form className="form-body" onSubmit={onSubmit}>
          <div className="form-fields">

            {/* Tipo + Marca */}
            <div className="form-grid form-grid-2">
              <div>
                <div className="form-select-wrapper">
                  <div className="form-select-icon left">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <label htmlFor="eq-tipo" className="sr-only">Tipo de equipo</label>
                  <select id="eq-tipo" name="tipo" required className="form-select with-icon-left"
                    value={values.tipo} onChange={handleChange}>
                    <option value="" disabled>Tipo de equipo*</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Impresora">Impresora</option>
                    <option value="Servidor">Servidor</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="eq-marca" className="sr-only">Marca</label>
                <input id="eq-marca" type="text" name="marca" placeholder="Marca*"
                  required className="form-input" value={values.marca} onChange={handleChange} />
              </div>
            </div>

            {/* Modelo + Serie */}
            <div className="form-grid form-grid-2">
              <div>
                <label htmlFor="eq-modelo" className="sr-only">Modelo</label>
                <input id="eq-modelo" type="text" name="modelo" placeholder="Modelo*"
                  required className="form-input" value={values.modelo} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="eq-serial" className="sr-only">Número de serie</label>
                <input id="eq-serial" type="text" name="numero_serie" placeholder="Número de serie*"
                  required className="form-input" value={values.numero_serie} onChange={handleChange} />
              </div>
            </div>

            {/* Cliente */}
            <div className="form-section">
              <h3 className="form-section-title">Cliente</h3>
              <div className="form-select-wrapper">
                <div className="form-select-icon left">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <label htmlFor="eq-cliente" className="sr-only">Cliente</label>
                <select id="eq-cliente" name="id_cliente" required className="form-select with-icon-left"
                  value={values.id_cliente} onChange={handleChange} disabled={loadingClientes}>
                  <option value="" disabled>
                    {loadingClientes ? 'Cargando clientes…' : clientes.length === 0 ? 'No hay clientes registrados' : 'Seleccionar cliente*'}
                  </option>
                  {clientes.map(c => (
                    <option key={c.id_cliente} value={c.id_cliente}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="form-btn form-btn-primary" disabled={loading || loadingClientes}>
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
