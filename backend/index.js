// ==============================================================================
// Archivo: index.js
// Descripción: Servidor principal Express para la API del Sistema Valle Hermoso.
// Proyecto: Actividad integradora 3. Infraestructura de servicios (UDG Virtual)
// ==============================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importación de módulos de rutas
const authRoutes = require('./routes/auth');
const cuotasRoutes = require('./routes/cuotas');

// Inicialización de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// ==============================================================================
// Middlewares Globales
// ==============================================================================

// Habilita el intercambio de recursos de origen cruzado (CORS) para frontend web
app.use(cors());

// Parseo de cuerpos de peticiones con formato JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de registro de peticiones (Logging) para trazabilidad en consola
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==============================================================================
// Definición de Rutas de la API
// ==============================================================================

// Ruta base informativa del estado del servicio
app.get('/', (req, res) => {
  res.status(200).json({
    sistema: 'API REST - Sistema Web de Pagos del Fraccionamiento Valle Hermoso',
    version: '1.0.0',
    estado: 'Servicio en línea',
    documentacion_endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      cuotas: {
        listar: 'GET /api/cuotas',
        detalle: 'GET /api/cuotas/:id',
        crear: 'POST /api/cuotas [Protegido con JWT]',
        actualizar: 'PUT /api/cuotas/:id [Protegido con JWT]',
        eliminar: 'DELETE /api/cuotas/:id [Protegido con JWT]'
      }
    }
  });
});

// Montaje de enrutadores modulares (Patrón MVC)
app.use('/api/auth', authRoutes);
app.use('/api/cuotas', cuotasRoutes);

// ==============================================================================
// Manejadores de Excepciones y Errores
// ==============================================================================

// Manejador para rutas no encontradas (404 Not Found)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Ruta ${req.originalUrl} no encontrada en esta API.`
  });
});

// Middleware global para captura y manejo de errores no controlados (500 Internal Server Error)
app.use((err, req, res, next) => {
  console.error('[SERVER GLOBAL ERROR]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno no controlado en el servidor.'
  });
});

// ==============================================================================
// Arranque del Servidor HTTP
// ==============================================================================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('==============================================================');
    console.log(`🚀 Servidor ejecutándose en el puerto: ${PORT}`);
    console.log(`📡 URL Base: http://localhost:${PORT}`);
    console.log(`🔒 Capa de Seguridad JWT: Habilitada en rutas POST/PUT/DELETE`);
    console.log('==============================================================');
  });
}

module.exports = app;
