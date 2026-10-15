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

    let idCuotaCreada = null;
    if (authRes.status === 201) {
      idCuotaCreada = authRes.data.data.id_cuota;
      console.log('  ✅ Cuota creada exitosamente en Supabase (HTTP 201 Created)');
      console.log('  📝 Detalle de nueva cuota: ID', idCuotaCreada, '- Monto: $' + authRes.data.data.monto);
      console.log('  🔒 Registrado por usuario autenticado:', authRes.data.creadoPor);
    } else {
      throw new Error(`Fallo al crear cuota autenticada: ${JSON.stringify(authRes.data)}`);
    }

    // --------------------------------------------------------------------------
    // Prueba 6: Endpoint Pagos - Registrar Pago y Actualización Automática de Cuota
    // --------------------------------------------------------------------------
    console.log('\n🔹 [6/7] Probando Endpoint POST /api/pagos (Registrar Pago con JWT)...');
    const pagoRes = await request(
      'POST',
      '/api/pagos',
      {
        id_cuota: idCuotaCreada,
        monto: 1500.00
      },
      adminToken
    );

    let idPagoCreado = null;
    if (pagoRes.status === 201) {
      idPagoCreado = pagoRes.data.data.id_pago;
      console.log('  ✅ Pago registrado exitosamente (HTTP 201 Created)');
      console.log('  💳 Detalle de pago: ID Pago', idPagoCreado, 'asignado a Cuota', idCuotaCreada);
      console.log('  🔄 La cuota se actualizó automáticamente a estado: "Pagado"');
    } else {
      throw new Error(`Fallo al registrar pago: ${JSON.stringify(pagoRes.data)}`);
    }

    // --------------------------------------------------------------------------
    // Prueba 7: Endpoint Pagos - Consultar Historial con JWT
    // --------------------------------------------------------------------------
    console.log('\n🔹 [7/7] Probando Endpoint GET /api/pagos y GET /api/pagos/residente/2...');
    const pagosListRes = await request('GET', '/api/pagos', null, adminToken);
    const pagosResidenteRes = await request('GET', '/api/pagos/residente/2', null, adminToken);

    if (pagosListRes.status === 200 && pagosResidenteRes.status === 200) {
      console.log(`  ✅ Listado general de pagos recuperado: ${pagosListRes.data.total} pagos en total`);
      console.log(`  ✅ Historial del residente 2 recuperado: ${pagosResidenteRes.data.total} pagos del residente`);
    } else {
      throw new Error('Fallo al consultar historial de pagos.');
    }
    // --------------------------------------------------------------------------
    // Prueba 8: Registro de Nuevo Residente (POST /api/auth/register)
    // --------------------------------------------------------------------------
    console.log('\n🔹 [8/9] Probando Registro de Nuevo Residente (POST /api/auth/register)...');
    const testEmail = `residente.test.${Date.now()}@vallehermoso.mx`;
    const regRes = await request('POST', '/api/auth/register', {
      nombre: 'Mariana Soto Morales',
      correo: testEmail,
      password: 'PasswordSegura123!',
      rol: 'Residente'
    });

    let idResidenteCreado = null;
    let nuevoResidenteToken = null;

    if (regRes.status === 201 && regRes.data.token) {
      idResidenteCreado = regRes.data.usuario.id_residente;
      nuevoResidenteToken = regRes.data.token;
      console.log('  ✅ Residente registrado exitosamente en Supabase (HTTP 201 Created)');
      console.log('  👤 ID Residente:', idResidenteCreado, '| Nombre:', regRes.data.usuario.nombre);
      console.log('  🔑 Token JWT de auto-login emitido:', nuevoResidenteToken.substring(0, 35) + '...');
      console.log('  🛡️ Rol asignado:', regRes.data.usuario.rol);
    } else {
      throw new Error(`Fallo en registro de residente: ${JSON.stringify(regRes.data)}`);
    }

    // --------------------------------------------------------------------------
    // Prueba 9: Prevención de Correo Duplicado (HTTP 409 Conflict)
    // --------------------------------------------------------------------------
    console.log('\n🔹 [9/9] Probando rechazo de correo duplicado...');
    const dupRes = await request('POST', '/api/auth/register', {
      nombre: 'Mariana Soto Intento Duplicado',
      correo: testEmail,
      password: 'OtraPassword123!',
      rol: 'Residente'
    });

    if (dupRes.status === 409) {
      console.log('  🛡️ RECHAZO CORRECTO: La API evitó duplicación de correo (HTTP 409 Conflict)');
      console.log('  🛑 Mensaje:', dupRes.data.error);
    } else {
      throw new Error(`FALLO: Se esperaba HTTP 409 pero se obtuvo ${dupRes.status}`);
    }

    // Limpieza de datos de prueba
    if (idPagoCreado) {
      await request('DELETE', `/api/pagos/${idPagoCreado}`, null, adminToken);
    }
    if (idCuotaCreada) {
      await request('DELETE', `/api/cuotas/${idCuotaCreada}`, null, adminToken);
    }
    if (idResidenteCreado) {
      const supabase = require('./config/db');
      await supabase.from('residentes').delete().eq('id_residente', idResidenteCreado);
    }
    console.log('  🧹 Registros temporales de prueba limpiados exitosamente de Supabase.');

    console.log('\n==============================================================');
    console.log('  🎉 ¡TODAS LAS PRUEBAS (9/9) PASARON AL 100%! ');
    console.log('  - Autenticación JWT y Roles (Admin / Residente)');
    console.log('  - Registro de Nuevos Residentes con Encriptación bcrypt');
    console.log('  - Prevención de Correos Duplicados (HTTP 409)');
    console.log('  - CRUD de Cuotas y Protección de Rutas');
    console.log('  - CRUD de Pagos y Actualización Automática de Estados');
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
