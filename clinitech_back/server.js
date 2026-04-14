/**
 * PUNTO DE ENTRADA DEL SERVIDOR
 * Carga variables de entorno e inicia Express
 */

require('dotenv').config();

const app  = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 CliniTech API corriendo en http://localhost:${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
});