/**
 * MIDDLEWARE: Auth
 * Verificación de token JWT y restricción por rol
 */

const jwt = require('jsonwebtoken');

/**
 * Verifica que la petición incluya un token JWT válido.
 * Si es válido, adjunta el payload a req.usuario y llama a next().
 */
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ ok: false, mensaje: 'Token requerido' });
  }

  try {
    const payload  = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario    = payload; // { id_usuario, id_perfil, rol, documento }
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' });
  }
};

/**
 * Restringe el acceso exclusivamente a usuarios con rol 'tecnico'.
 * Debe usarse después de verificarToken.
 */
const soloTecnico = (req, res, next) => {
  if (req.usuario?.rol !== 'tecnico') {
    return res.status(403).json({ ok: false, mensaje: 'Acceso restringido a técnicos' });
  }
  next();
};

module.exports = { verificarToken, soloTecnico };
