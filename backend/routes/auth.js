// ==============================================================================
// Archivo: routes/auth.js
// Descripción: Rutas para autenticación y registro de residentes/administradores.
// ==============================================================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login -> Iniciar sesión y obtener token JWT
router.post('/login', authController.login);

// POST /api/auth/register -> Registrar nuevo residente con contraseña encriptada
router.post('/register', authController.register);

module.exports = router;
