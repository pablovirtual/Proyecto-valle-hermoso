// ==============================================================================
// Archivo: config/db.js
// Descripción: Configuración y conexión al cliente de Supabase (PostgreSQL BaaS).
// ==============================================================================

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Extracción de las variables de entorno necesarias para la conexión
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Validación preventiva de configuración
if (!supabaseUrl || !supabaseKey) {
  console.error('[DATABASE ERROR] Variables de entorno SUPABASE_URL o SUPABASE_KEY no definidas.');
  console.error('[DATABASE TIP] Revisa el archivo .env en la raíz del proyecto backend.');
}

/**
 * Cliente de conexión oficial de Supabase.
 * Proporciona métodos de consulta fluida (fluent API) para interactuar
 * con las tablas de PostgreSQL respetando las reglas de la base de datos.
 */
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false // Indicado para arquitecturas stateless en servidores backend
  }
});

module.exports = supabase;
