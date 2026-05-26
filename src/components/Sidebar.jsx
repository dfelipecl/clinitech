import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

/* ── Datos de navegación ─────────────────────────────────────────────────── */

const NAV_TECNICO = [
  {
    id: 'registros',
    label: 'Registros',
    icon: '/assets/icons/regs.svg',
    children: [
      { section: 'registrar-tecnico', label: 'Registrar Técnico' },
      { section: 'registrar-cliente', label: 'Registrar Cliente' },
      { section: 'registrar-equipo',  label: 'Registrar Equipo' },
    ],
  },
  {
    id: 'documentos',
    label: 'Documentos',
    icon: '/assets/icons/docs.svg',
    children: [
      { section: 'documento-recepcion', label: 'Generar Documento de Recepción' },
      { section: 'documento-entrega',   label: 'Generar Documento de Entrega/Garantía' },
      { section: 'documento-garantia',  label: 'Generar Documento de Proceso de Garantía' },
    ],
  },
  {
    id: 'reparaciones',
    label: 'Reparaciones',
    icon: '/assets/icons/reps.svg',
    children: [
      { section: 'ingresar-equipo',       label: 'Ingresar equipo a Diagnóstico/Reparación' },
      { section: 'gestionar-reparacion',  label: 'Gestionar reparación' },
      { section: 'actualizar-estado',     label: 'Actualizar estado de un equipo' },
    ],
  },
  {
    id: 'historial',
    label: 'Historial de reparaciones',
    icon: '/assets/icons/his.svg',
    section: 'historial',
  },
]

const NAV_TECNICO_BOTTOM = [
  { section: 'mensajes',        label: 'Mensajes',        icon: '/assets/icons/msjs.svg',  badge: 3 },
  { section: 'notificaciones',  label: 'Notificaciones',  icon: '/assets/icons/notis.svg', badge: 7 },
]

const NAV_CLIENTE = [
  { section: 'mis-servicios',   label: 'Mis servicios',   icon: '/assets/icons/regs.svg' },
  { section: 'mensajes',        label: 'Mensajes',        icon: '/assets/icons/msjs.svg' },
  { section: 'notificaciones',  label: 'Notificaciones',  icon: '/assets/icons/notis.svg' },
]

/* ── Componente principal ────────────────────────────────────────────────── */

export default function Sidebar({ rol, activeSection, onNavigate, mobileOpen, onMobileClose }) {
  const { session } = useAuth()

  // Estado de colapso desktop — persiste en localStorage igual que el original
  const [collapsed, setCollapsed] = useState(
    () => JSON.parse(localStorage.getItem('sidebarCollapsed') || 'false')
  )

  // Submenú abierto (solo uno a la vez)
  const [openSubmenu, setOpenSubmenu] = useState(null)

  // Refs para medir scrollHeight real de cada submenú (igual que el original)
  const submenuRefs = useRef({})

  // Cerrar submenús al colapsar (igual que navigation.js original)
  useEffect(() => {
    if (collapsed) setOpenSubmenu(null)
  }, [collapsed])

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem('sidebarCollapsed', JSON.stringify(next))
      return next
    })
  }

  const toggleSubmenu = (id) => {
    if (collapsed) return // sin efecto si está colapsado
    setOpenSubmenu(prev => (prev === id ? null : id))
  }

  const handleNav = (section) => {
    onNavigate(section)
    if (mobileOpen) onMobileClose()
  }

  const isClient = rol === 'cliente'
  const navItems = isClient ? NAV_CLIENTE : NAV_TECNICO

  /* Clases del aside */
  const sidebarClass = [
    'bg-tech-blue flex flex-col rounded-tr-3xl rounded-br-3xl',
    'transition-all duration-300 relative z-20 pb-1',
    collapsed ? 'w-20' : 'w-80',
    'fixed lg:static inset-y-0 left-0 h-full lg:h-auto',
    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
  ].join(' ')

  return (
    <>
      <aside className={sidebarClass} aria-label="Menú lateral">

        {/* ── Cabecera ── */}
        <div className="p-8 flex items-center justify-between text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/assets/img/mini-logo-white.png"
              alt="CliniTech"
              className="w-8 object-contain flex-shrink-0"
            />
            {!collapsed && (
              <span className="font-semibold text-2xl whitespace-nowrap sidebar-text">MENÚ</span>
            )}
          </div>
          {/* Toggle colapso — solo desktop */}
          <button
            onClick={toggleCollapsed}
            className="hidden lg:block text-white hover:text-gray-200 transition-colors"
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            <HamburgerIcon />
          </button>
        </div>

        {/* Espaciador superior — solo panel cliente */}
        {isClient && <div className="flex-1" />}

        {/* ── Navegación principal ── */}
        <nav
          className={[
            'px-6 space-y-1 min-h-0',
            !isClient && 'flex-1 pt-12 overflow-y-auto',
          ].filter(Boolean).join(' ')}
          id="navigation"
          aria-label="Navegación principal"
        >
          {navItems.map(item => {
            /* Item con submenú */
            if (item.children) {
              const isOpen = openSubmenu === item.id
              // Alto real del submenú para animación suave (como scrollHeight en el original)
              const submenuHeight = submenuRefs.current[item.id]?.scrollHeight ?? 500

              return (
                <div key={item.id}>
                  <button
                    type="button"
                    id={`${item.id}-btn`}
                    onClick={() => toggleSubmenu(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`submenu-${item.id}`}
                    className={menuBtnClass(false, collapsed)}
                  >
                    <img src={item.icon} alt="" aria-hidden="true" className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left sidebar-text">{item.label}</span>
                        <ChevronIcon open={isOpen} />
                      </>
                    )}
                  </button>

                  {/* Submenú con animación por maxHeight real */}
                  {!collapsed && (
                    <div
                      id={`submenu-${item.id}`}
                      ref={el => { submenuRefs.current[item.id] = el }}
                      className="ml-8 sidebar-submenu overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight: isOpen ? `${submenuHeight}px` : '0px',
                        opacity:   isOpen ? 1 : 0,
                      }}
                    >
                      {item.children.map(child => (
                        <button
                          key={child.section}
                          type="button"
                          onClick={() => handleNav(child.section)}
                          className={submenuLinkClass(activeSection === child.section)}
                        >
                          <span
                            className={[
                              'w-2 h-2 rounded-full inline-block shrink-0 mt-1.5 transition-colors',
                              activeSection === child.section ? 'bg-tech-accent' : 'bg-white',
                            ].join(' ')}
                            aria-hidden="true"
                          />
                          <span className="sidebar-text">{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            /* Item simple */
            return (
              <div key={item.section}>
                <button
                  type="button"
                  onClick={() => handleNav(item.section)}
                  className={menuBtnClass(activeSection === item.section, collapsed)}
                  aria-label={item.label}
                >
                  <img src={item.icon} alt="" aria-hidden="true" className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 text-left sidebar-text">{item.label}</span>
                  )}
                </button>
              </div>
            )
          })}
        </nav>

        {/* ── Mensajes y notificaciones — solo técnico, parte baja ── */}
        {!isClient && (
          <div
            id="messages-notifications"
            className={[
              'px-6 py-4 space-y-1',
              collapsed && 'flex flex-col items-center px-2 space-y-2',
            ].filter(Boolean).join(' ')}
          >
            {NAV_TECNICO_BOTTOM.map(item => (
              <button
                key={item.section}
                type="button"
                onClick={() => handleNav(item.section)}
                className={[
                  menuBtnClass(activeSection === item.section, collapsed),
                  'relative',
                ].join(' ')}
                aria-label={`${item.label}${item.badge ? `, ${item.badge} nuevos` : ''}`}
              >
                <img src={item.icon} alt="" aria-hidden="true" className="w-4 h-4 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left sidebar-text">{item.label}</span>
                    {item.badge && (
                      <span
                        className="sidebar-badge bg-tech-accent text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center"
                        aria-label={`${item.badge} nuevos`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {/* Badge visible también en modo colapsado */}
                {collapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 bg-tech-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Espaciador inferior — solo panel cliente */}
        {isClient && <div className="flex-1" />}

        {/* ── Tarjeta de usuario ── */}
        <div
          id="user-info"
          className={[
            'mx-7 mb-8 bg-white rounded-xl shadow-sm flex items-center gap-3 mt-6',
            collapsed ? 'p-0 justify-center mx-auto w-10 h-10 bg-transparent shadow-none' : 'p-4',
          ].join(' ')}
        >
          {/* Avatar */}
          <div className="w-10 h-10 bg-tech-blue rounded-full flex items-center justify-center flex-shrink-0 sidebar-user">
            <UserIcon />
          </div>

          {/* Nombre + documento (ocultos al colapsar) */}
          {!collapsed && (
            <div className="flex-1 min-w-0 sidebar-user">
              <p className="text-sm font-semibold text-tech-blue truncate">
                {session ? `${session.nombre} ${session.apellido}` : '—'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session?.correo || session?.documento || '—'}
              </p>
            </div>
          )}

          {/* Botón de 3 puntos — sin funcionalidad por ahora */}
          {!collapsed && (
            <button
              type="button"
              title="Opciones"
              aria-label="Opciones de usuario"
              className="sidebar-user-menu text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              disabled
            >
              <DotsIcon />
            </button>
          )}
        </div>
      </aside>

      {/* ── Overlay móvil ── */}
      {mobileOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}
    </>
  )
}

/* ── Helpers de clases ───────────────────────────────────────────────────── */

function menuBtnClass(active, collapsed) {
  return [
    'menu-btn w-full flex items-center gap-3 text-white rounded-lg px-4 py-2 text-sm transition-colors duration-200',
    active ? 'active' : 'hover:bg-white/10',
    collapsed && 'justify-center w-10 h-10 p-0 mx-auto mb-2',
  ].filter(Boolean).join(' ')
}

function submenuLinkClass(active) {
  return [
    'submenu-link w-full flex items-start gap-2 rounded p-2 text-sm text-left',
    active ? 'active text-tech-accent' : 'text-white',
  ].join(' ')
}

/* ── Iconos inline ───────────────────────────────────────────────────────── */

function HamburgerIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="5"  cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  )
}
