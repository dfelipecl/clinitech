/**
 * RUTAS: Equipos
 * Endpoints para la gestión de equipos de cómputo
 */

const { Router } = require('express');
const { body }   = require('express-validator');

const EquipoController             = require('../controllers/equipoController');
const { verificarToken, soloTecnico } = require('../middlewares/auth');
const { validar }                  = require('../middlewares/validate');

const router = Router();

// Todas las rutas de este módulo requieren token válido
router.use(verificarToken);

// GET /api/equipos — lista todos los equipos
router.get('/', soloTecnico, EquipoController.listar);

// GET /api/equipos/:id — equipo por ID
router.get('/:id', EquipoController.obtener);

// POST /api/equipos — registrar nuevo equipo
router.post('/', soloTecnico, [
  body('marca').notEmpty().withMessage('La marca es requerida'),
  body('modelo').notEmpty().withMessage('El modelo es requerido'),
  body('numero_serie').notEmpty().withMessage('El número de serie es requerido'),
  body('id_cliente')
    .notEmpty().withMessage('El cliente es requerido')
    .isInt({ min: 1 }).withMessage('id_cliente debe ser un número entero positivo'),
  validar,
], EquipoController.registrar);

// PUT /api/equipos/:id — actualizar datos del equipo
router.put('/:id', soloTecnico, [
  body('marca').optional().notEmpty().withMessage('La marca no puede estar vacía'),
  body('modelo').optional().notEmpty().withMessage('El modelo no puede estar vacío'),
  body('numero_serie').optional().notEmpty().withMessage('El número de serie no puede estar vacío'),
  validar,
], EquipoController.actualizar);

// DELETE /api/equipos/:id — eliminar equipo sin reparaciones activas
router.delete('/:id', soloTecnico, EquipoController.eliminar);

module.exports = router;
