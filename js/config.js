/**
 * CONFIGURACIÓN DE TAILWIND CSS
 * Define los colores y tipografías personalizados del proyecto.
 * Estos valores se usan en las clases de Tailwind (ej: bg-tech-blue, font-poppins).
 * Centralizar aquí facilita cambios de identidad visual sin editar cada archivo.
 */
// Configuración de Tailwind CSS
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'tech-blue': '#3852AE',
        'tech-light': '#bad6eb',
        'tech-accent': '#40AAFF'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      }
    }
  }
}
