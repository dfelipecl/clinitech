import { useState } from 'react'
import PanelLayout from '../components/PanelLayout'
import RegistrarCliente     from '../views/tecnico/registros/RegistrarCliente'
import RegistrarTecnico     from '../views/tecnico/registros/RegistrarTecnico'
import RegistrarEquipo      from '../views/tecnico/registros/RegistrarEquipo'
import IngresoEquipo        from '../views/tecnico/reparaciones/IngresoEquipo'
import ActualizarEstado     from '../views/tecnico/reparaciones/ActualizarEstado'
import HistorialReparaciones from '../views/tecnico/HistorialReparaciones'

const TITLES = {
  default:                'Panel Técnico CliniTech',
  'registrar-tecnico':    'Registrar Técnico',
  'registrar-cliente':    'Registrar Cliente',
  'registrar-equipo':     'Registrar Equipo',
  'documento-recepcion':  'Generar Documento de Recepción',
  'documento-entrega':    'Generar Documento de Entrega / Garantía',
  'documento-garantia':   'Generar Documento de Proceso de Garantía',
  'ingresar-equipo':      'Ingresar Equipo a Diagnóstico / Reparación',
  'gestionar-reparacion': 'Gestionar Reparación',
  'actualizar-estado':    'Actualizar Estado de un Equipo',
  'historial':            'Historial de Reparaciones',
  'mensajes':             'Mensajes',
  'notificaciones':       'Notificaciones',
}

export default function PanelTecnicoPage() {
  const [activeSection, setActiveSection] = useState(null)
  const title = activeSection ? (TITLES[activeSection] ?? 'Panel Técnico CliniTech') : TITLES.default

  return (
    <PanelLayout
      rol="tecnico"
      title={title}
      activeSection={activeSection}
      onNavigate={setActiveSection}
    >
      <PanelContent section={activeSection} onBack={() => setActiveSection(null)} />
    </PanelLayout>
  )
}

function PanelContent({ section, onBack }) {
  if (!section) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500 mt-56">
          <h2 className="text-2xl font-semibold mb-2">Bienvenido al Panel Técnico</h2>
          <p className="text-lg">Selecciona una opción del menú lateral para comenzar</p>
        </div>
      </div>
    )
  }

  const props = { onBack }

  switch (section) {
    case 'registrar-cliente':    return <RegistrarCliente     {...props} />
    case 'registrar-tecnico':    return <RegistrarTecnico     {...props} />
    case 'registrar-equipo':     return <RegistrarEquipo      {...props} />
    case 'ingresar-equipo':      return <IngresoEquipo        {...props} />
    case 'actualizar-estado':    return <ActualizarEstado     {...props} />
    case 'historial':            return <HistorialReparaciones {...props} />
    default:
      return (
        <div className="form-view">
          <div className="form-header">
            <button type="button" className="form-back-btn" onClick={onBack} aria-label="Regresar al panel principal">
              <img src="/assets/icons/return.svg" alt="" aria-hidden="true" />
              <span>Regresar</span>
            </button>
          </div>
          <div className="form-container flex items-center justify-center">
            <div className="relative z-10 text-center text-gray-500">
              <h2 className="text-2xl font-semibold mb-2">{TITLES[section] ?? section}</h2>
              <p className="text-lg">Funcionalidad en desarrollo</p>
              <p className="text-sm mt-4 text-gray-400">El contenido se mostrará aquí una vez implementado</p>
            </div>
          </div>
        </div>
      )
  }
}
