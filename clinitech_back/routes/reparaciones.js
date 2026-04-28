/**
 * RUTAS: Reparaciones
 * Endpoints para la gestión de órdenes de reparación
 */

const { Router } = require('express');
const { body }   = require('express-validator');

const ReparacionController         = require('../controllers/reparacioncontroller');
const { verificarToken, soloTecnico } = require('../middlewares/auth');
const { validar }                  = require('../middlewares/validate');

const router = Router();

// Todas las rutas de este módulo requieren token válido
router.use(verificarToken);

// GET /api/reparaciones — lista todas las reparaciones
router.get('/', soloTecnico, ReparacionController.listar);

// GET /api/reparaciones/:id — reparación por ID
router.get('/:id', ReparacionController.obtener);

// POST /api/reparaciones — registrar nueva orden
router.post('/', soloTecnico, [
  body('diagnostico').notEmpty().withMessage('El diagnóstico es requerido'),
  body('procedimiento').notEmpty().withMessage('El procedimiento es requerido'),
  body('id_tecnico')
    .notEmpty().withMessage('El técnico es requerido')
    .isInt({ min: 1 }).withMessage('id_tecnico debe ser un número entero positivo'),
  body('id_equipo')
    .notEmpty().withMessage('El equipo es requerido')
    .isInt({ min: 1 }).withMessage('id_equipo debe ser un número entero positivo'),
  validar,
], ReparacionController.registrar);

// PUT /api/reparaciones/:id/estado — actualizar estado de la reparación
router.put('/:id/estado', soloTecnico, [
  body('estado')
    .optional()
    .isIn(['recibido', 'diagnostico', 'en_reparacion', 'listo', 'entregado'])
    .withMessage('Estado inválido'),
  body('costo_total')
    .optional()
    .isFloat({ min: 0 }).withMessage('El costo total debe ser un número positivo'),
  validar,
], ReparacionController.actualizarEstado);

// DELETE /api/reparaciones/:id — eliminar orden en estado 'recibido'
router.delete('/:id', soloTecnico, ReparacionController.eliminar);

module.exports = router;
