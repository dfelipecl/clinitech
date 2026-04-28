/**
 * RUTAS: Auth
 * Endpoints públicos de autenticación y registro
 */

const { Router } = require('express');
const { body }   = require('express-validator');

const AuthController       = require('../controllers/authController');
const { verificarToken }   = require('../middlewares/auth');
const { validar }          = require('../middlewares/validate');

const router = Router();

// POST /api/auth/login
router.post('/login', [
  body('documento')
    .notEmpty().withMessage('El documento es requerido')
    .isNumeric().withMessage('El documento debe ser numérico'),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
  validar,
], AuthController.login);

// POST /api/auth/registrar
router.post('/registrar', [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('documento')
    .notEmpty().withMessage('El documento es requerido')
    .isNumeric().withMessage('El documento debe ser numérico'),
  body('correo').isEmail().withMessage('El correo no tiene un formato válido'),
  body('rol')
    .isIn(['tecnico', 'cliente']).withMessage('El rol debe ser tecnico o cliente'),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
  body('especialidad')
    .if(body('rol').equals('tecnico'))
    .notEmpty().withMessage('La especialidad es requerida para técnicos'),
  validar,
], AuthController.registrar);

// GET /api/auth/sesion — requiere token válido
router.get('/sesion', verificarToken, AuthController.obtenerSesion);

module.exports = router;
