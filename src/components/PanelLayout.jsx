import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../hooks/useNotification'

/**
 * Layout compartido entre PanelTecnicoPage y PanelClientePage.
 *
 * Props:
 *   rol           — 'tecnico' | 'cliente'
 *   title         — título del header (cambia según la vista activa)
 *   children      — contenido de la vista activa
 *   activeSection — sección activa (para resaltar ítem del menú)
 *   onNavigate    — callback al elegir sección en el sidebar
 */
export default function PanelLayout({ rol, title, children, activeSection, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout } = useAuth()
  const { notify } = useNotification()
  const navigate = useNavigate()

  function handleLogout() {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout()
      notify('Sesión cerrada correctamente', 'info', 1500)
      navigate('/')
    }
  }

  return (
    <div className="font-poppins bg-tech-light min-h-screen overflow-hidden">
      <div className="flex h-screen">

        {/* Sidebar */}
        <Sidebar
          rol={rol}
          activeSection={activeSection}
          onNavigate={onNavigate}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Área principal */}
        <main className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <header className="bg-white rounded-b-3xl shadow-sm px-8 py-4 mx-10 relative z-10 flex-shrink-0">
            <div className="flex items-center justify-between">

              {/* Hamburguesa — solo móvil */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-tech-blue hover:text-tech-accent transition-colors mr-4"
                aria-label="Abrir menú de navegación"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <h1 id="page-title" className="text-2xl font-semibold text-tech-blue truncate">
                {title}
              </h1>

              {/* Botón de cerrar sesión — único en toda la UI */}
              <button
                type="button"
                id="logout-btn"
                onClick={handleLogout}
                className="text-tech-blue font-semibold flex items-center gap-3 hover:text-blue-700 transition-colors"
                aria-label="Cerrar sesión"
              >
                <span className="hidden sm:inline">Cerrar sesión</span>
                <img src="/assets/icons/cerse.svg" alt="" aria-hidden="true" className="w-4 h-4 flex-shrink-0" />
              </button>
            </div>
          </header>

          {/* Contenido dinámico */}
          <div className="flex-1 p-10 py-12 overflow-hidden">
            <div className="bg-white rounded-3xl shadow-sm h-full relative overflow-hidden">

              {/* Marca de agua */}
              <div className="logo-watermark" aria-hidden="true">
                <img src="/assets/img/Logo.png" alt="" className="w-64 opacity-[0.04]" />
              </div>

              {/* Vista activa con scroll */}
              <div className="relative z-10 h-full overflow-y-auto">
                {children}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
