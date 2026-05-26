import { useState, useEffect } from 'react'
import { getReparaciones } from '../../services/api'

const ESTADOS = {
  recibido:             { label: 'Recibido',                color: 'bg-blue-100 text-blue-700' },
  en_diagnostico:       { label: 'En diagnóstico',          color: 'bg-yellow-100 text-yellow-700' },
  pendiente_aprobacion: { label: 'Pendiente de aprobación', color: 'bg-purple-100 text-purple-700' },
  en_reparacion:        { label: 'En reparación',           color: 'bg-orange-100 text-orange-700' },
  reparado:             { label: 'Reparado',                color: 'bg-green-100 text-green-700' },
  rechazado:            { label: 'Rechazado',               color: 'bg-red-100 text-red-700' },
  cancelado:            { label: 'Cancelado',               color: 'bg-gray-100 text-gray-600' },
}

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatPeso(val) {
  if (!val && val !== 0) return '—'
  return '$' + Number(val).toLocaleString('es-CO')
}

export default function HistorialReparaciones({ onBack }) {
  const [reparaciones, setReparaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getReparaciones()
      .then(data => setReparaciones(data.datos || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="form-view">
      <div className="form-header">
        <button type="button" className="form-back-btn" onClick={onBack} aria-label="Regresar al panel principal">
          <img src="/assets/icons/return.svg" alt="" aria-hidden="true" />
          <span>Regresar</span>
        </button>
      </div>

      <div className="form-container" style={{ maxWidth: '100%' }}>
        <div className="logo-watermark">
          <img src="/assets/img/Logo.png" alt="CliniTech Logo" />
        </div>

        <h2 className="form-title">Historial de reparaciones</h2>

        <div className="relative z-10 mt-4">
          {loading && (
            <div className="text-center py-8 text-gray-400">
              <div className="loading-spinner mx-auto" />
              <p className="mt-2">Cargando reparaciones...</p>
            </div>
          )}

          {error && (
            <p className="text-center text-red-400 py-8">Error al cargar el historial: {error}</p>
          )}

          {!loading && !error && reparaciones.length === 0 && (
            <p className="text-center text-gray-400 py-8">No hay reparaciones registradas aún.</p>
          )}

          {!loading && !error && reparaciones.length > 0 && (
            <>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left">
                  <thead className="bg-tech-blue text-white text-sm">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-xl">ID</th>
                      <th className="px-4 py-3">Equipo</th>
                      <th className="px-4 py-3">Serie</th>
                      <th className="px-4 py-3">Diagnóstico</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Costo estimado</th>
                      <th className="px-4 py-3 rounded-tr-xl">Fecha ingreso</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {reparaciones.map(r => {
                      const est = ESTADOS[r.estado] || { label: r.estado, color: 'bg-gray-100 text-gray-600' }
                      return (
                        <tr key={r.id_reparacion} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700">#{r.id_reparacion}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{r.marca || ''} {r.modelo || ''}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{r.numero_serie || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{r.diagnostico || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${est.color}`}>
                              {est.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{formatPeso(r.costo_estimado)}</td>
                          <td className="px-4 py-3 text-sm text-gray-400">{formatFecha(r.fecha_inicio)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-right">{reparaciones.length} registro(s) encontrado(s)</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
