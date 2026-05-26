import { useCallback } from 'react'

/**
 * Hook para mostrar notificaciones toast.
 * Equivalente a Utils.showNotification del proyecto original.
 * Inyecta el elemento directo en el DOM para no depender de estado React.
 */
export function useNotification() {
  const notify = useCallback((message, type = 'info', duration = 3000) => {
    const colors = {
      info:    'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error:   'bg-red-500',
    }

    const el = document.createElement('div')
    el.className = [
      'fixed top-4 right-4 z-50',
      'font-poppins text-sm text-white px-6 py-3',
      'rounded-xl shadow-lg',
      'transform transition-all duration-300 translate-x-full',
      colors[type] || colors.info,
    ].join(' ')
    el.textContent = message

    document.body.appendChild(el)
    requestAnimationFrame(() => el.classList.remove('translate-x-full'))

    setTimeout(() => {
      el.classList.add('translate-x-full')
      setTimeout(() => el.remove(), 300)
    }, duration)
  }, [])

  return { notify }
}
