// ==============================================================================
// Archivo: routes/cuotas.js
// Descripción: Rutas para la gestión de Cuotas (CRUD) con protección JWT.
// ==============================================================================

const express = require('express');
const router = express.Router();
const cuotasController = require('../controllers/cuotasController');
const { verifyToken } = require('../middlewares/auth');

/**
 * ------------------------------------------------------------------------------
 * Rutas Públicas / Consulta
 * ------------------------------------------------------------------------------
 */

// GET /api/cuotas -> Listar todas las cuotas (con posibilidad de filtrar)
router.get('/', cuotasController.getAllCuotas);

// GET /api/cuotas/:id -> Obtener el detalle de una cuota en particular
router.get('/:id', cuotasController.getCuotaById);

/**
 * ------------------------------------------------------------------------------
 * Rutas Protegidas por Capa de Seguridad (verifyToken)
 * Requieren cabecera HTTP: 'Authorization: Bearer <token>'
 * ------------------------------------------------------------------------------
 */

// POST /api/cuotas -> Crear / emitir una nueva cuota (Protegido con JWT)
router.post('/', verifyToken, cuotasController.createCuota);

// PUT /api/cuotas/:id -> Actualizar estado o monto de una cuota (Protegido con JWT)
router.put('/:id', verifyToken, cuotasController.updateCuota);

// DELETE /api/cuotas/:id -> Eliminar una cuota existente (Protegido con JWT)
router.delete('/:id', verifyToken, cuotasController.deleteCuota);

module.exports = router;
