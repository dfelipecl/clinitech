/**
 * RUTAS: Clientes
 * Endpoints para la consulta de clientes registrados.
 */

const { Router } = require('express');

const ClienteController                   = require('../controllers/clienteController');
const { verificarToken, soloTecnico } = require('../middlewares/auth');

const router = Router();

// Todas las rutas de este módulo requieren token válido
router.use(verificarToken);

// GET /api/clientes — lista todos los clientes (solo técnicos)
router.get('/', soloTecnico, ClienteController.listar);

module.exports = router;
