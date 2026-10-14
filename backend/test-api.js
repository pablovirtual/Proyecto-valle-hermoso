// ==============================================================================
// Archivo: test-api.js
// Descripción: Script de prueba automatizado para verificar el funcionamiento
//              de toda la infraestructura de servicios y la capa de seguridad JWT.
// ==============================================================================

const http = require('http');
require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;

// Función auxiliar para realizar peticiones HTTP nativas
function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let payload = null;
    if (body) {
      payload = JSON.stringify(body);
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      url,
      {
        method,
        headers
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, data: parsed });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('\n==============================================================');
  console.log('   PRUEBA INTEGRAL DEL SISTEMA - FRACCIONAMIENTO VALLE HERMOSO');
  console.log('==============================================================\n');

  try {
    // --------------------------------------------------------------------------
    // Prueba 1: Estado general de la API
    // --------------------------------------------------------------------------
    console.log('🔹 [1/5] Verificando estado del servidor...');
    const health = await request('GET', '/');
    if (health.status === 200) {
      console.log('  ✅ Servidor en línea (HTTP 200):', health.data.sistema);
    } else {
      throw new Error(`Fallo en estado de servidor (HTTP ${health.status})`);
    }

    // --------------------------------------------------------------------------
    // Prueba 2: Login y Generación de Token JWT
    // --------------------------------------------------------------------------
    console.log('\n🔹 [2/5] Probando autenticación (Login con credenciales)...');
    const loginRes = await request('POST', '/api/auth/login', {
      correo: 'admin@vallehermoso.mx',
      password: 'Admin123!'
    });

    if (loginRes.status === 200 && loginRes.data.token) {
      console.log('  ✅ Login exitoso como Administrador (HTTP 200)');
      console.log('  🔑 Token JWT generado:', loginRes.data.token.substring(0, 40) + '...');
      console.log('  👤 Usuario identificado:', loginRes.data.usuario.nombre, `(${loginRes.data.usuario.rol})`);
    } else {
      throw new Error(`Fallo en Login: ${JSON.stringify(loginRes.data)}`);
    }

    const adminToken = loginRes.data.token;

    // --------------------------------------------------------------------------
    // Prueba 3: Consulta de Cuotas (Ruta de Lectura)
    // --------------------------------------------------------------------------
    console.log('\n🔹 [3/5] Consultando cuotas en Supabase...');
    const cuotasRes = await request('GET', '/api/cuotas');
    if (cuotasRes.status === 200) {
      console.log(`  ✅ Cuotas recuperadas de Supabase: ${cuotasRes.data.total} registradas`);
    } else {
      throw new Error(`Fallo al consultar cuotas: ${JSON.stringify(cuotasRes.data)}`);
    }

    // --------------------------------------------------------------------------
    // Prueba 4: Verificación de la Capa de Seguridad (Ruta Protegida SIN Token)
    // --------------------------------------------------------------------------
    console.log('\n🔹 [4/5] Probando Capa de Seguridad: Intentando crear cuota SIN token...');
    const unauthRes = await request('POST', '/api/cuotas', {
      id_residente: 2,
      monto: 1500.00,
      estado: 'Pendiente'
    });

    if (unauthRes.status === 401) {
      console.log('  🛡️ SEGURIDAD ACTIVA: La API rechazó correctamente la petición anónima (HTTP 401 Unauthorized)');
      console.log('  🛑 Mensaje de error retornado:', unauthRes.data.error);
    } else {
      throw new Error(`FALLO DE SEGURIDAD: La API no protegió la ruta (HTTP ${unauthRes.status})`);
    }

    // --------------------------------------------------------------------------
    // Prueba 5: Operación Transaccional CON Token JWT Válido
    // --------------------------------------------------------------------------
    console.log('\n🔹 [5/5] Probando Capa de Seguridad: Creando cuota CON token JWT en Header...');
    const authRes = await request(
      'POST',
      '/api/cuotas',
      {
        id_residente: 2,
        monto: 1500.00,
        estado: 'Pendiente'
      },
      adminToken
    );

    if (authRes.status === 201) {
      console.log('  ✅ Cuota creada exitosamente en Supabase (HTTP 201 Created)');
      console.log('  📝 Detalle de nueva cuota: ID', authRes.data.data.id_cuota, '- Monto: $' + authRes.data.data.monto);
      console.log('  🔒 Registrado por usuario autenticado:', authRes.data.creadoPor);

      // Limpieza de la cuota de prueba
      const idCreado = authRes.data.data.id_cuota;
      await request('DELETE', `/api/cuotas/${idCreado}`, null, adminToken);
      console.log(`  🧹 Cuota de prueba (ID ${idCreado}) eliminada tras la verificación.`);
    } else {
      throw new Error(`Fallo al crear cuota autenticada: ${JSON.stringify(authRes.data)}`);
    }

    console.log('\n==============================================================');
    console.log('  🎉 ¡TODAS LAS PRUEBAS PASARON AL 100%! ');
    console.log('  La infraestructura de servicios, base de datos Supabase');
    console.log('  y capa de seguridad JWT están funcionando perfectamente.');
    console.log('==============================================================\n');

  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA PRUEBA:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
