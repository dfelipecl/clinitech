import { useState, useCallback } from 'react'

/**
 * Hook genérico para manejar formularios.
 * Centraliza lo que antes hacía FormHandler.handleFormSubmit + validateBasicForm.
 */
export function useForm(initialValues = {}) {
  const [values, setValues]   = useState(initialValues)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo al escribir
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }, [errors])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  const handleSubmit = useCallback((onSubmit, validate) => async (e) => {
    e.preventDefault()

    if (validate) {
      const validationErrors = validate(values)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }
    }

    setLoading(true)
    try {
      await onSubmit(values)
    } finally {
      setLoading(false)
    }
  }, [values])

  return { values, errors, loading, handleChange, handleSubmit, reset, setErrors }
}
