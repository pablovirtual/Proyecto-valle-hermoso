// ==============================================================================
// Archivo: routes/pagos.js
// Descripción: Rutas para la gestión de Pagos con protección JWT.
// Todas las rutas de Pagos requieren autenticación.
// ==============================================================================

const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');
const { verifyToken } = require('../middlewares/auth');

// Todas las rutas de pagos requieren autenticación JWT
// GET /api/pagos -> Listar todos los pagos (con filtro opcional ?id_cuota=X)
router.get('/', verifyToken, pagosController.getAllPagos);

// GET /api/pagos/residente/:id_residente -> Historial de pagos de un residente
router.get('/residente/:id_residente', verifyToken, pagosController.getPagosByResidente);

// GET /api/pagos/:id -> Obtener un pago específico por ID
router.get('/:id', verifyToken, pagosController.getPagoById);

// POST /api/pagos -> Registrar un nuevo pago (actualiza estado de cuota automáticamente)
router.post('/', verifyToken, pagosController.createPago);

// DELETE /api/pagos/:id -> Eliminar pago y revertir cuota a Pendiente
router.delete('/:id', verifyToken, pagosController.deletePago);

module.exports = router;
