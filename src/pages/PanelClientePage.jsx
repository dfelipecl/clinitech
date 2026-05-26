import { useState } from 'react'
import PanelLayout from '../components/PanelLayout'
import MisServicios from '../views/cliente/MisServicios'

const TITLES = {
  default:          'Panel Cliente CliniTech',
  'mis-servicios':  'Mis Servicios',
  'mensajes':       'Mensajes',
  'notificaciones': 'Notificaciones',
}

export default function PanelClientePage() {
  const [activeSection, setActiveSection] = useState(null)
  const title = activeSection ? (TITLES[activeSection] ?? 'Panel Cliente CliniTech') : TITLES.default

  return (
    <PanelLayout
      rol="cliente"
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
          <h2 className="text-2xl font-semibold mb-2">Bienvenido al Panel Cliente</h2>
          <p className="text-lg">Selecciona una opción del menú lateral para comenzar</p>
        </div>
      </div>
    )
  }

  const props = { onBack }

  switch (section) {
    case 'mis-servicios': return <MisServicios {...props} />
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
