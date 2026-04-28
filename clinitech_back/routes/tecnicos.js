/**
 * RUTAS: Tecnicos
 * Endpoints para la gestión de técnicos (requieren autenticación)
 */

const { Router } = require('express');
const { body }   = require('express-validator');

const TecnicoController        = require('../controllers/tecnicoController');
const { verificarToken, soloTecnico } = require('../middlewares/auth');
const { validar }              = require('../middlewares/validate');

const router = Router();

// Todas las rutas de este módulo requieren token válido
router.use(verificarToken);

// GET /api/tecnicos — lista todos los técnicos
router.get('/', soloTecnico, TecnicoController.listar);

// GET /api/tecnicos/mis-reparaciones — reparaciones del técnico autenticado
// Debe definirse antes de /:id para que Express no lo interprete como un ID
router.get('/mis-reparaciones', soloTecnico, TecnicoController.misReparaciones);

// GET /api/tecnicos/:id — técnico por ID
router.get('/:id', soloTecnico, TecnicoController.obtener);

// PUT /api/tecnicos/:id — actualizar especialidad y/o estado
router.put('/:id', soloTecnico, [
  body('especialidad').optional().notEmpty().withMessage('La especialidad no puede estar vacía'),
  body('estado')
    .optional()
    .isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo'),
  validar,
], TecnicoController.actualizar);

// DELETE /api/tecnicos/:id — desactivación lógica del técnico
router.delete('/:id', soloTecnico, TecnicoController.desactivar);

module.exports = router;
