/**
 * CONFIGURACIÓN DE LA APLICACIÓN
 * Inicializa Express, middlewares globales y registro de rutas
 */

const express = require('express');
const cors    = require('cors');

const authRoutes        = require('./routes/auth');
const tecnicosRoutes    = require('./routes/tecnicos');
const reparacionesRoutes = require('./routes/reparaciones');
const equiposRoutes     = require('./routes/equipos');
const { manejarError } = require('./middlewares/errorHandler');

const app = express();

// ── Middlewares globales ──────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Registro de rutas ─────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/tecnicos',     tecnicosRoutes);
app.use('/api/reparaciones', reparacionesRoutes);
app.use('/api/equipos',      equiposRoutes);

// ── Ruta de verificación ──────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, mensaje: 'CliniTech API funcionando' });
});

// ── Manejo de errores (siempre al final) ──────────────────
app.use(manejarError);

module.exports = app;
