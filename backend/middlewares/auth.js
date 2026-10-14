// ==============================================================================
// Archivo: middlewares/auth.js
// Descripción: Capa de seguridad y middleware de autenticación/autorización con JWT.
// ==============================================================================

const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar la validez del token JWT provisto en las cabeceras HTTP.
 * Intercepta peticiones entrantes a rutas protegidas.
 *
 * @param {import('express').Request} req - Objeto de petición HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para transferir el control al siguiente middleware/controlador.
 */
const verifyToken = (req, res, next) => {
  // 1. Obtener la cabecera 'Authorization'
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  // 2. Validar presencia del header y formato 'Bearer <token>'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Acceso no autorizado: Se requiere una cabecera Authorization con formato Bearer <token>.'
    });
  }

  // 3. Extraer el token separándolo del prefijo 'Bearer '
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verificar firma criptográfica y expiración usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Inyectar el payload decodificado en el objeto 'req' para acceso posterior
    req.user = decoded;

    // 6. Ceder el control al siguiente manejador de la ruta
    next();
  } catch (error) {
    // Manejo de errores específicos del estándar JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Sesión expirada: El token proporcionado ha vencido. Inicie sesión nuevamente.'
      });
    }

    return res.status(403).json({
      success: false,
      error: 'Acceso prohibido: Token no válido, firma alterada o corrupto.'
    });
  }
};

/**
 * Middleware complementario de control de acceso basado en roles (RBAC).
 * Permite restringir operaciones exclusivamente a roles permitidos (ej. 'Administrador').
 *
 * @param  {...string} allowedRoles - Lista de roles permitidos para la operación.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        error: `Acceso denegado: Se requiere alguno de los siguientes roles: [${allowedRoles.join(', ')}].`
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles
};
