# CliniTech - Sistema de Gestión de Reparaciones

Sistema web para la gestión de reparaciones de equipos de cómputo con paneles diferenciados para técnicos y clientes.

## Características

### Para Técnicos

- Registro de técnicos, clientes y equipos
- Generación automática de documentos
- Gestión completa del ciclo de reparación
- Historial completo de reparaciones
- Sistema de mensajes y notificaciones

### Para Clientes

- Seguimiento de servicios en curso
- Consulta de historial
- Mensajería con técnicos
- Notificaciones de estado

### Características Técnicas

- SPA sin recargas
- Responsive design
- Accesibilidad WCAG 2.1
- UI moderna con Tailwind
- Autenticación por sesión
- Optimizado para rendimiento

## Tecnologías

- HTML5 Semántico
- CSS3 + Tailwind CSS 3.x
- JavaScript ES6+ (Vanilla)
- Google Fonts (Poppins)

## Acceso Rápido

### Con Visual Studio Code

1. Instalar extensión **Live Server/Live Preview**
2. Abrir proyecto en VS Code
3. Click derecho en `index.html` → **Open with Live Server/Live Preview**

## 🎯 Uso

### Credenciales de Prueba

|    Tipo     | Documento  |    Contraseña     |     Panel     |
|-------------|------------|-------------------|---------------|
| **Técnico** | `12345678` | Mín. 6 caracteres | Panel Técnico |
| **Cliente** | `28765432` | Mín. 6 caracteres | Panel Cliente |

*El sistema detecta el rol por el primer dígito del documento. 1 para Técnico, 2+ para Cliente*

## Personalización

### Colores

Edita `js/config.js`:

```javascript
colors: {
  'tech-blue': '#3852AE',
  'tech-light': '#bad6eb',
  'tech-accent': '#40AAFF'
}
```

### Logos

Reemplaza archivos en `assets/img/`:
- `Logo.png`
- `mini-logo-white.png`

---

## 🗺️ Roadmap

### Completado
- Estructura base y arquitectura
- Sistema de autenticación
- Navegación dinámica
- Diseño responsive

### En Progreso
- Vistas funcionales completas
- Integración con backend
- Sistema de notificaciones real

### Planificado
- Dashboard con estadísticas
- Generación de PDFs
- Chat en tiempo real
- PWA (Aplicación móvil)

## Licencia

Privado - Uso exclusivo CliniTech  
© 2026 CliniTech. Todos los derechos reservados.

**Hecho con ❤️ por David Felipe Castro León para CliniTech**
## Proyecto SENA