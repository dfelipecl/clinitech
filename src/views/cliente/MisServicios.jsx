import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getReparaciones } from '../../services/api'

const ESTADOS = {
  recibido:             { label: 'Recibido',             color: 'bg-blue-100 text-blue-700',    icon: '📥' },
  en_diagnostico:       { label: 'En diagnóstico',       color: 'bg-yellow-100 text-yellow-700', icon: '🔍' },
  pendiente_aprobacion: { label: 'Pendiente de aprobación', color: 'bg-purple-100 text-purple-700', icon: '⏳' },
  en_reparacion:        { label: 'En reparación',        color: 'bg-orange-100 text-orange-700', icon: '🔧' },
  reparado:             { label: 'Listo para recoger',   color: 'bg-green-100 text-green-700',  icon: '✅' },
  rechazado:            { label: 'Rechazado',            color: 'bg-red-100 text-red-700',      icon: '❌' },
  cancelado:            { label: 'Cancelado',            color: 'bg-gray-100 text-gray-600',    icon: '📦' },
}

export default function MisServicios({ onBack }) {
  const { session } = useAuth()
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getReparaciones()
      .then(data => {
        const todas = data.datos || []
        const mias = session?.id_cliente
          ? todas.filter(r => r.id_cliente === session.id_cliente)
          : todas
        setServicios(mias)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [session])

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

        <h2 className="form-title">Mis servicios</h2>

        <div className="relative z-10 mt-4">
          {loading && (
            <div className="text-center py-8 text-gray-400">
              <div className="loading-spinner mx-auto" />
              <p className="mt-2">Cargando tus servicios...</p>
            </div>
          )}

          {error && (
            <p className="text-center text-red-400 py-8">Error al cargar los servicios: {error}</p>
          )}

          {!loading && !error && servicios.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">🖥️</p>
              <p className="text-lg font-medium">No tienes servicios registrados</p>
              <p className="text-sm mt-1">Cuando lleves un equipo al taller aparecerá aquí</p>
            </div>
          )}

          {!loading && !error && servicios.length > 0 && (
            <>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {servicios.map(r => {
                  const est = ESTADOS[r.estado] || { label: r.estado, color: 'bg-gray-100 text-gray-600', icon: '❓' }
                  const costo = r.costo_estimado ? '$' + Number(r.costo_estimado).toLocaleString('es-CO') : 'Por definir'
                  const fecha = r.fecha_inicio
                    ? new Date(r.fecha_inicio).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
                    : '—'

                  return (
                    <div key={r.id_reparacion} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-tech-blue text-lg">{r.marca || ''} {r.modelo || ''}</p>
                          <p className="text-sm text-gray-400">S/N: {r.numero_serie || '—'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${est.color}`}>
                          {est.icon} {est.label}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Diagnóstico:</span> {r.diagnostico || '—'}</p>
                        <p><span className="font-medium">Costo estimado:</span> {costo}</p>
                        <p className="text-xs text-gray-400 pt-1">Ingreso: {fecha} · Orden #{r.id_reparacion}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-gray-400 mt-4 text-right">{servicios.length} servicio(s)</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
