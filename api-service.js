/**
 * ==============================================================================
 * Archivo: api-service.js
 * Descripción: Capa de servicio para la comunicación del frontend con la
 *              API REST del Sistema Valle Hermoso (Node.js + Express + Supabase).
 * Patrón: Service Layer / Repository - Desacopla la lógica de UI de las llamadas HTTP.
 * ==============================================================================
 */

// URL base de la API REST backend. Cambiar a la URL de producción al desplegar.
const API_BASE_URL = 'http://localhost:3000/api';

// ==============================================================================
// GESTIÓN DE SESIÓN (Token JWT en sessionStorage)
// ==============================================================================

/**
 * Guarda el token JWT y los datos del usuario autenticado en sessionStorage.
 * sessionStorage se limpia automáticamente al cerrar la pestaña del navegador.
 * @param {string} token - Token JWT emitido por el backend.
 * @param {object} usuario - Objeto con datos del usuario autenticado.
 */
function saveSession(token, usuario) {
  sessionStorage.setItem('vh_token', token);
  sessionStorage.setItem('vh_usuario', JSON.stringify(usuario));
}

/**
 * Obtiene el token JWT activo de sessionStorage.
 * @returns {string|null} El token JWT o null si no hay sesión activa.
 */
function getToken() {
  return sessionStorage.getItem('vh_token');
}

/**
 * Obtiene el objeto del usuario autenticado desde sessionStorage.
 * @returns {object|null} El objeto de usuario o null.
 */
function getCurrentUser() {
  const raw = sessionStorage.getItem('vh_usuario');
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Verifica si hay una sesión activa con token JWT.
 * @returns {boolean}
 */
function isAuthenticated() {
  return !!getToken();
}

/**
 * Elimina la sesión del usuario de sessionStorage (Cierre de sesión).
 */
function clearSession() {
  sessionStorage.removeItem('vh_token');
  sessionStorage.removeItem('vh_usuario');
}

// ==============================================================================
// FUNCIÓN AUXILIAR PARA PETICIONES HTTP (fetch wrapper)
// ==============================================================================

/**
 * Realiza una petición HTTP a la API REST con manejo de errores centralizado.
 * Incluye automáticamente el token JWT en el encabezado Authorization si existe.
 *
 * @param {string} endpoint - Ruta del endpoint (ej. '/auth/login').
 * @param {string} method - Método HTTP ('GET', 'POST', 'PUT', 'DELETE').
 * @param {object|null} body - Cuerpo de la petición en formato objeto (opcional).
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  // Adjuntar token JWT si existe
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Error HTTP ${response.status}`
      };
    }

    return { success: true, data };
  } catch (networkError) {
    console.error('[API SERVICE] Error de red:', networkError);
    return {
      success: false,
      error: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000'
    };
  }
}

// ==============================================================================
// MÓDULO: AUTENTICACIÓN
// ==============================================================================

/**
 * Inicia sesión en el sistema con correo y contraseña.
 * Guarda el token JWT y los datos del usuario en sessionStorage.
 *
 * @param {string} correo
 * @param {string} password
 * @returns {Promise<{success: boolean, usuario?: object, error?: string}>}
 */
async function apiLogin(correo, password) {
  const result = await apiRequest('/auth/login', 'POST', { correo, password });

  if (result.success) {
    saveSession(result.data.token, result.data.usuario);
    return { success: true, usuario: result.data.usuario };
  }

  return { success: false, error: result.error };
}

/**
 * Cierra la sesión del usuario actual eliminando el token.
 */
function apiLogout() {
  clearSession();
}

// ==============================================================================
// MÓDULO: CUOTAS
// ==============================================================================

/**
 * Obtiene las cuotas de un residente específico desde Supabase.
 * @param {number} id_residente - ID del residente.
 * @returns {Promise<Array>} - Lista de cuotas.
 */
async function apiGetCuotasByResidente(id_residente) {
  const result = await apiRequest(`/cuotas?id_residente=${id_residente}`);
  return result.success ? result.data.data : [];
}

/**
 * Obtiene todas las cuotas (uso administrativo).
 * @returns {Promise<Array>}
 */
async function apiGetAllCuotas() {
  const result = await apiRequest('/cuotas');
  return result.success ? result.data.data : [];
}

/**
 * Crea una nueva cuota para un residente.
 * @param {number} id_residente
 * @param {number} monto
 * @param {string} estado - 'Pendiente', 'Pagado', 'Atrasado'
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
async function apiCreateCuota(id_residente, monto, estado = 'Pendiente') {
  return await apiRequest('/cuotas', 'POST', { id_residente, monto, estado });
}

/**
 * Actualiza el estado o monto de una cuota existente.
 * @param {number} id_cuota
 * @param {object} updates - { monto?, estado? }
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
async function apiUpdateCuota(id_cuota, updates) {
  return await apiRequest(`/cuotas/${id_cuota}`, 'PUT', updates);
}

/**
 * Elimina una cuota del sistema.
 * @param {number} id_cuota
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function apiDeleteCuota(id_cuota) {
  return await apiRequest(`/cuotas/${id_cuota}`, 'DELETE');
}

// ==============================================================================
// MÓDULO: PAGOS
// ==============================================================================

/**
 * Registra un nuevo pago para una cuota.
 * El backend actualiza automáticamente el estado de la cuota a 'Pagado'.
 * @param {number} id_cuota
 * @param {number} monto
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
async function apiRegistrarPago(id_cuota, monto) {
  return await apiRequest('/pagos', 'POST', { id_cuota, monto });
}

/**
 * Obtiene el historial de pagos de un residente.
 * @param {number} id_residente
 * @returns {Promise<Array>}
 */
async function apiGetPagosByResidente(id_residente) {
  const result = await apiRequest(`/pagos/residente/${id_residente}`);
  return result.success ? result.data.data : [];
}

/**
 * Obtiene todos los pagos registrados (uso administrativo).
 * @returns {Promise<Array>}
 */
async function apiGetAllPagos() {
  const result = await apiRequest('/pagos');
  return result.success ? result.data.data : [];
}

/**
 * Verifica si el backend está disponible. Útil para mostrar indicadores de conexión.
 * @returns {Promise<boolean>}
 */
async function apiHealthCheck() {
  try {
    const response = await fetch('http://localhost:3000', { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}

// ==============================================================================
// EXPORTACIÓN GLOBAL (Accesible desde app.js en el navegador)
// ==============================================================================
window.VHApi = {
  // Sesión
  saveSession,
  getToken,
  getCurrentUser,
  isAuthenticated,
  clearSession,
  // Auth
  login: apiLogin,
  logout: apiLogout,
  // Cuotas
  getCuotasByResidente: apiGetCuotasByResidente,
  getAllCuotas: apiGetAllCuotas,
  createCuota: apiCreateCuota,
  updateCuota: apiUpdateCuota,
  deleteCuota: apiDeleteCuota,
  // Pagos
  registrarPago: apiRegistrarPago,
  getPagosByResidente: apiGetPagosByResidente,
  getAllPagos: apiGetAllPagos,
  // Utilidades
  healthCheck: apiHealthCheck
};
