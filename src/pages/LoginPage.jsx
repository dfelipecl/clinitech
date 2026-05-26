import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../hooks/useNotification'
import { validateDocument, validatePassword } from '../utils/format'

export default function LoginPage() {
  const { login, isAuthenticated, session } = useAuth()
  const { notify } = useNotification()
  const navigate = useNavigate()

  const [documento, setDocumento]       = useState('')
  const [password, setPassword]         = useState('')
  const [showPass, setShowPass]         = useState(false)
  const [loading, setLoading]           = useState(false)
  const [errors, setErrors]             = useState({ documento: false, password: false })

  // Si ya hay sesión, redirigir al panel correcto
  if (isAuthenticated) {
    return <Navigate to={session.rol === 'tecnico' ? '/tecnico' : '/cliente'} replace />
  }

  function validate() {
    const e = {
      documento: !validateDocument(documento),
      password:  !validatePassword(password),
    }
    setErrors(e)
    return !e.documento && !e.password
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const s = await login(documento, password)
      notify(`¡Bienvenido, ${s.nombre}!`, 'success', 2000)
      setTimeout(() => navigate(s.rol === 'tecnico' ? '/tecnico' : '/cliente'), 800)
    } catch (err) {
      notify(err.message || 'Error al iniciar sesión', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="font-poppins bg-tech-light min-h-screen flex items-center justify-center p-4">
      <main className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl flex flex-col lg:flex-row">

        {/* Panel izquierdo — formulario */}
        <section className="lg:w-1/2 p-8 sm:p-12 bg-white flex flex-col justify-center min-h-[500px] lg:min-h-[600px]">
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-tech-blue">Iniciar sesión</h1>
          </header>

          <form className="space-y-6" noValidate onSubmit={handleSubmit}>

            {/* Campo documento */}
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium mb-2 text-tech-blue">
                Usuario
              </label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                placeholder="Número de documento de identidad"
                required
                autoComplete="username"
                inputMode="numeric"
                pattern="[0-9]*"
                value={documento}
                onChange={e => { setDocumento(e.target.value); setErrors(p => ({ ...p, documento: false })) }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tech-blue focus:border-transparent transition-all duration-200 text-gray-600 placeholder-gray-400"
              />
              {errors.documento && (
                <span className="text-red-500 text-xs mt-1 block" role="alert">
                  Por favor ingresa un documento válido
                </span>
              )}
            </div>

            {/* Campo contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-tech-blue">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  required
                  autoComplete="current-password"
                  minLength={6}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: false })) }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tech-blue focus:border-transparent transition-all duration-200 text-gray-600 placeholder-gray-400 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                >
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 block" role="alert">
                  La contraseña debe tener al menos 6 caracteres
                </span>
              )}
            </div>

            {/* Olvidé contraseña */}
            <div className="text-right">
              <a href="#" className="text-tech-blue text-sm hover:underline focus:underline focus:outline-none">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-tech-blue text-white py-3 rounded-xl font-semibold hover:bg-[#2d4190] focus:bg-[#2d4190] focus:outline-none focus:ring-2 focus:ring-tech-blue focus:ring-offset-2 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Spinner /> : 'INICIAR SESIÓN'}
            </button>
          </form>
        </section>

        {/* Panel derecho — decorativo */}
        <aside className="lg:w-1/2 bg-tech-blue relative overflow-hidden flex flex-col items-center justify-center p-8 sm:p-12 text-center min-h-[400px] lg:min-h-[600px]">
          <div className="absolute top-10 right-10 w-24 sm:w-32 h-24 sm:h-32 bg-white bg-opacity-10 rounded-full" />
          <div className="absolute bottom-10 left-10 w-20 sm:w-24 h-20 sm:h-24 bg-white bg-opacity-10 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-12 sm:w-16 h-12 sm:h-16 bg-white bg-opacity-5 rounded-full" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6">¡Hola, Bienvenido!</h2>
            <p className="text-white text-base sm:text-lg mb-8 leading-relaxed max-w-md">
              Ingresa con tus datos personales para usar todas las funciones de CliniTech
            </p>
            <div className="flex justify-center">
              <img
                src="/assets/img/Logo.png"
                alt="Logo CliniTech"
                className="h-12 sm:h-16 max-w-full object-contain filter invert brightness-0"
              />
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

/* ── Iconos inline (sin dependencia externa) ──────────────────────────────── */

function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}
