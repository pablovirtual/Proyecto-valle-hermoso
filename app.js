/**
 * SISTEMA WEB DE PAGOS - FRACCIONAMIENTO VALLE HERMOSO
 * Prototipo Funcional | Proyecto VI & VII - UDG Virtual
 * Desarrollador: Pedro Pablo Rodríguez Gómez
 */

// ================= ESTADO Y BASE DE DATOS LOCAL (LocalStorage) =================
const DEFAULT_DATA = {
  currentRole: 'resident', // 'landing', 'resident', 'admin'
  activeResidentLot: 14,
  
  // Catálogo de Lotes y Residentes (25 lotes)
  residents: [
    { lot: 1, street: 'Av. Las Palmas #101', name: 'Laura Elena Moreno', phone: '33 1204 5510', email: 'laura.moreno@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 2, street: 'Av. Las Palmas #102', name: 'Javier Castillo Silva', phone: '33 3492 8821', email: 'javier.castillo@gmail.com', status: 'adeudo', balance: 1200 },
    { lot: 3, street: 'Av. Las Palmas #103', name: 'Sofía Navarro Díaz', phone: '33 9821 4432', email: 'sofia.navarro@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 4, street: 'Av. Las Palmas #104', name: 'Martín Morales Ramos', phone: '33 4455 6677', email: 'martin.morales@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 5, street: 'Av. Las Palmas #105', name: 'Patricia Vega Treviño', phone: '33 2233 4455', email: 'patricia.vega@gmail.com', status: 'adeudo', balance: 2400 },
    { lot: 6, street: 'C. Los Laureles #201', name: 'Gonzalo Estrada López', phone: '33 7788 9900', email: 'gonzalo.estrada@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 7, street: 'C. Los Laureles #202', name: 'Mónica Rivas Méndez', phone: '33 6677 8899', email: 'monica.rivas@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 8, street: 'C. Los Laureles #203', name: 'Héctor Carrillo Garza', phone: '33 5566 7788', email: 'hector.carrillo@gmail.com', status: 'adeudo', balance: 1200 },
    { lot: 9, street: 'C. Los Laureles #204', name: 'Daniela Flores Cruz', phone: '33 4433 2211', email: 'daniela.flores@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 10, street: 'C. Los Laureles #205', name: 'Roberto Santana Soto', phone: '33 3322 1100', email: 'roberto.santana@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 11, street: 'C. Los Pinos #101', name: 'Elena Delgado Pardo', phone: '33 9988 7766', email: 'elena.delgado@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 12, street: 'C. Los Pinos #102', name: 'Fernando Quiroz Luna', phone: '33 8877 6655', email: 'fernando.quiroz@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 13, street: 'C. Los Pinos #103', name: 'Gabriela Ortiz Rosas', phone: '33 7766 5544', email: 'gabriela.ortiz@gmail.com', status: 'adeudo', balance: 1200 },
    { lot: 14, street: 'C. Los Pinos #104', name: 'Carlos Ramírez Morales', phone: '33 1122 3344', email: 'carlos.ramirez@vallehermoso.mx', status: 'adeudo', balance: 1200 },
    { lot: 15, street: 'C. Los Pinos #105', name: 'Claudia Torres Beltrán', phone: '33 6655 4433', email: 'claudia.torres@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 16, street: 'C. Los Sauces #301', name: 'Ignacio Fuentes Solís', phone: '33 5544 3322', email: 'ignacio.fuentes@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 17, street: 'C. Los Sauces #302', name: 'Valeria Guzmán Peña', phone: '33 4433 1122', email: 'valeria.guzman@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 18, street: 'C. Los Sauces #303', name: 'Arturo Benítez Paz', phone: '33 3322 4455', email: 'arturo.benitez@gmail.com', status: 'adeudo', balance: 1200 },
    { lot: 19, street: 'C. Los Sauces #304', name: 'Silvia Pacheco Lara', phone: '33 2211 5566', email: 'silvia.pacheco@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 20, street: 'C. Los Sauces #305', name: 'Mauricio Lara Ríos', phone: '33 1100 6677', email: 'mauricio.lara@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 21, street: 'C. Jacarandas #401', name: 'Beatriz Salazar Cano', phone: '33 9900 1122', email: 'beatriz.salazar@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 22, street: 'C. Jacarandas #402', name: 'Rodrigo Campos Gil', phone: '33 8899 2233', email: 'rodrigo.campos@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 23, street: 'C. Jacarandas #403', name: 'Estela Miranda Ruiz', phone: '33 7788 3344', email: 'estela.miranda@gmail.com', status: 'adeudo', balance: 1200 },
    { lot: 24, street: 'C. Jacarandas #404', name: 'Hugo Domínguez Arce', phone: '33 6677 4455', email: 'hugo.dominguez@gmail.com', status: 'al_corriente', balance: 0 },
    { lot: 25, street: 'C. Jacarandas #405', name: 'Adriana Ponce Vaca', phone: '33 5566 5566', email: 'adriana.ponce@gmail.com', status: 'al_corriente', balance: 0 }
  ],

  // Cuotas del Residente Activo (Lote 14)
  residentFees: [
    {
      id: 'fee-101',
      concept: 'Mantenimiento Mensual Ordinario',
      period: 'Octubre 2026',
      amount: 1200,
      dueDate: '2026-10-10',
      status: 'pending', // 'pending', 'paid', 'under_review'
      type: 'ordinaria',
      description: 'Seguridad 24/7 en caseta, recolección de basura, alumbrado público y jardines.'
    },
    {
      id: 'fee-100',
      concept: 'Mantenimiento Mensual Ordinario',
      period: 'Septiembre 2026',
      amount: 1200,
      dueDate: '2026-09-10',
      status: 'paid',
      type: 'ordinaria',
      paymentDate: '2026-09-08',
      folio: 'VH-2026-0715',
      method: 'Tarjeta de Débito (Visa *4242)',
      description: 'Seguridad 24/7 en caseta, recolección de basura y mantenimiento de alberca.'
    },
    {
      id: 'fee-099',
      concept: 'Cuota Extraordinaria: Reparación Bomba de Agua',
      period: 'Agosto 2026',
      amount: 450,
      dueDate: '2026-08-20',
      status: 'paid',
      type: 'extraordinaria',
      paymentDate: '2026-08-15',
      folio: 'VH-2026-0590',
      method: 'Transferencia SPEI (BBVA)',
      description: 'Sustitución de motor y empaques del pozo de abastecimiento.'
    }
  ],

  // Historial General de Transacciones de Pagos
  payments: [
    {
      id: 'pay-001',
      folio: 'VH-2026-0715',
      lot: 14,
      resident: 'Carlos Ramírez Morales',
      concept: 'Mantenimiento Mensual Ordinario - Septiembre 2026',
      amount: 1200,
      method: 'Tarjeta de Débito (Visa *4242)',
      date: '2026-09-08 11:24',
      status: 'Aprobado',
      ref: 'TXN-984210',
      seal: 'SHA256:4a8b7c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f'
    },
    {
      id: 'pay-002',
      folio: 'VH-2026-0590',
      lot: 14,
      resident: 'Carlos Ramírez Morales',
      concept: 'Cuota Extraordinaria: Reparación Bomba - Agosto 2026',
      amount: 450,
      method: 'Transferencia SPEI',
      date: '2026-08-15 16:40',
      status: 'Aprobado',
      ref: 'SPEI-849102',
      seal: 'SHA256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f'
    },
    // Pagos pendientes de conciliar por el Administrador (SPEI)
    {
      id: 'pay-003',
      folio: 'VH-2026-0810',
      lot: 2,
      resident: 'Javier Castillo Silva',
      concept: 'Mantenimiento Mensual - Octubre 2026',
      amount: 1200,
      method: 'Transferencia SPEI',
      date: '2026-10-10 18:32',
      status: 'Por Conciliar',
      ref: 'VH-L02-202610',
      receiptFile: 'comprobante_spei_bbva_lote02.pdf'
    },
    {
      id: 'pay-004',
      folio: 'VH-2026-0811',
      lot: 8,
      resident: 'Héctor Carrillo Garza',
      concept: 'Mantenimiento Mensual - Octubre 2026',
      amount: 1200,
      method: 'Transferencia SPEI',
      date: '2026-10-11 09:15',
      status: 'Por Conciliar',
      ref: 'VH-L08-202610',
      receiptFile: 'captura_transferencia_santander_lote08.jpg'
    }
  ],

  // Egresos del Fraccionamiento (Gastos Operativos)
  expenses: [
    { id: 'exp-1', date: '2026-10-01', category: 'Seguridad Privada', concept: 'Quincena 1 Servicio Vigilancia Caseta 24/7', vendor: 'Seguridad Élite de Occidente S.A.', amount: 6500, approvedBy: 'Mesa Directiva' },
    { id: 'exp-2', date: '2026-10-03', category: 'Servicios Públicos (CFE/Agua)', concept: 'Pago Recibo CFE Luminarias y Caseta', vendor: 'Comisión Federal de Electricidad', amount: 2850, approvedBy: 'Mesa Directiva' },
    { id: 'exp-3', date: '2026-10-05', category: 'Mantenimiento y Jardinería', concept: 'Poda de árboles, corte de césped y fertilización', vendor: 'Jardinería Los Olivos', amount: 3100, approvedBy: 'Mesa Directiva' },
    { id: 'exp-4', date: '2026-10-08', category: 'Administración y Papelería', concept: 'Insumos de oficina, tóner y credenciales', vendor: 'Papelería Modelo', amount: 1800, approvedBy: 'Administración' }
  ],

  // Bitácora de Auditoría (Trazabilidad)
  auditLogs: [
    { timestamp: '2026-10-11 11:30', user: 'admin@vallehermoso.mx', action: 'Acceso al panel administrativo' },
    { timestamp: '2026-10-11 09:15', user: 'hector.carrillo@gmail.com', action: 'Registro de transferencia SPEI ref VH-L08-202610' },
    { timestamp: '2026-10-10 18:32', user: 'javier.castillo@gmail.com', action: 'Registro de transferencia SPEI ref VH-L02-202610' },
    { timestamp: '2026-10-08 14:10', user: 'admin@vallehermoso.mx', action: 'Registro de egreso #exp-4 ($1,800 MXN)' },
    { timestamp: '2026-10-01 08:00', user: 'sistema', action: 'Generación masiva de cuota de mantenimiento mensual Octubre 2026' }
  ],

  // Datos Fiscales del Residente (CFDI 4.0)
  taxProfile: {
    rfc: 'RAMC850412AA1',
    name: 'CARLOS RAMIREZ MORALES',
    regimen: '605',
    uso: 'G03',
    cp: '44100',
    email: 'carlos.ramirez@vallehermoso.mx'
  }
};

let appState = {};

// Cargar o Inicializar Estado
function initApp() {
  const stored = localStorage.getItem('valle_hermoso_state');
  if (stored) {
    try {
      appState = JSON.parse(stored);
    } catch (e) {
      appState = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  } else {
    appState = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveState();
  }

  // Sincronizar selector de roles en cabecera
  const switcher = document.getElementById('role-quick-switcher');
  if (switcher) switcher.value = appState.currentRole;

  updateNavigation();
  showCurrentView();

  // Verificar conexión con la API REST y Supabase
  checkBackendConnection().then(isOnline => {
    if (isOnline && window.VHApi && window.VHApi.isAuthenticated()) {
      syncBackendData();
    }
  });
}

function saveState() {
  localStorage.setItem('valle_hermoso_state', JSON.stringify(appState));
}

function resetDemoData() {
  if (confirm('¿Deseas reiniciar los datos del prototipo al estado inicial de prueba?')) {
    localStorage.removeItem('valle_hermoso_state');
    appState = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveState();
    initApp();
    alert('Datos de prueba reiniciados correctamente.');
  }
}

// ================= GESTIÓN DE ROLES Y NAVEGACIÓN =================
function switchRole(newRole) {
  appState.currentRole = newRole;
  saveState();
  const switcher = document.getElementById('role-quick-switcher');
  if (switcher) switcher.value = newRole;
  updateNavigation();
  showCurrentView();
}

function updateNavigation() {
  const navLinks = document.getElementById('nav-links');
  const userActions = document.getElementById('nav-user-actions');
  
  if (appState.currentRole === 'landing') {
    navLinks.innerHTML = `
      <a href="#" onclick="navigateTo('landing')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 bg-brand-50">Inicio</a>
      <a href="#avisos" onclick="navigateTo('landing')" class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900">Avisos y Cuotas</a>
      <a href="#reglamento" onclick="navigateTo('landing')" class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900">Reglamento</a>
    `;
    userActions.innerHTML = `
      <button onclick="openLoginModal()" class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5">
        <i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
      </button>
    `;
  } else if (appState.currentRole === 'resident') {
    navLinks.innerHTML = `
      <button onclick="switchResidentTab('cuotas')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">Mis Cuotas</button>
      <button onclick="switchResidentTab('historial')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">Historial</button>
      <button onclick="switchResidentTab('facturacion')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">Facturación</button>
    `;
    userActions.innerHTML = `
      <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
        <div class="w-8 h-8 rounded-full bg-emerald-100 text-brand-700 flex items-center justify-center font-bold text-xs">
          CR
        </div>
        <div class="hidden sm:block text-left">
          <div class="text-xs font-bold text-slate-800 leading-tight">Carlos Ramírez</div>
          <div class="text-[10px] text-slate-500">Lote 14 • Residente</div>
        </div>
        <button onclick="switchRole('landing')" title="Cerrar sesión" class="text-slate-400 hover:text-rose-500 text-xs ml-2">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    `;
  } else if (appState.currentRole === 'admin') {
    navLinks.innerHTML = `
      <button onclick="switchAdminTab('conciliacion')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">Conciliación</button>
      <button onclick="switchAdminTab('residentes')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">Padrón</button>
      <button onclick="switchAdminTab('egresos')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">Egresos</button>
      <button onclick="switchAdminTab('reportes')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">Reportes</button>
    `;
    userActions.innerHTML = `
      <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
        <div class="w-8 h-8 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-xs">
          MD
        </div>
        <div class="hidden sm:block text-left">
          <div class="text-xs font-bold text-slate-800 leading-tight">Mesa Directiva</div>
          <div class="text-[10px] text-emerald-600 font-semibold">Administrador</div>
        </div>
        <button onclick="switchRole('landing')" title="Cerrar sesión" class="text-slate-400 hover:text-rose-500 text-xs ml-2">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    `;
  }
}

function showCurrentView() {
  document.getElementById('view-landing').classList.add('hidden');
  document.getElementById('view-resident').classList.add('hidden');
  document.getElementById('view-admin').classList.add('hidden');

  if (appState.currentRole === 'landing') {
    document.getElementById('view-landing').classList.remove('hidden');
  } else if (appState.currentRole === 'resident') {
    document.getElementById('view-resident').classList.remove('hidden');
    renderResidentView();
  } else if (appState.currentRole === 'admin') {
    document.getElementById('view-admin').classList.remove('hidden');
    renderAdminView();
  }
}

function navigateTo(role) {
  switchRole(role);
}

// ================= CONEXIÓN Y ESTADO DEL BACKEND API =================
async function checkBackendConnection() {
  const badge = document.getElementById('api-status-badge');
  const dot = document.getElementById('api-status-dot');
  const text = document.getElementById('api-status-text');
  if (!badge) return false;

  try {
    if (window.VHApi && await window.VHApi.healthCheck()) {
      badge.className = "flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
      badge.title = "Backend REST y Supabase conectados en vivo (http://localhost:3000)";
      if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block";
      if (text) text.textContent = "API En Línea (Supabase)";
      return true;
    }
  } catch (err) {
    console.warn('[BACKEND STATUS]:', err);
  }

  badge.className = "flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40";
  badge.title = "Backend desconectado. Inicia el servidor con 'npm start' en la carpeta backend/";
  if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-amber-400 inline-block";
  if (text) text.textContent = "API Desconectada";
  return false;
}

// Modal Login
function openLoginModal() {
  const feedback = document.getElementById('login-feedback');
  if (feedback) feedback.classList.add('hidden');
  document.getElementById('modal-login').classList.remove('hidden');
}

function closeLoginModal() {
  document.getElementById('modal-login').classList.add('hidden');
}

function handleLoginRoleChange(role) {
  const labelRes = document.getElementById('label-role-resident');
  const labelAdm = document.getElementById('label-role-admin');
  const userInp = document.getElementById('login-username');
  const passInp = document.getElementById('login-password');
  const feedback = document.getElementById('login-feedback');
  if (feedback) feedback.classList.add('hidden');

  if (role === 'resident') {
    if (labelRes) labelRes.className = "flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition border-brand-500 bg-brand-50/50";
    if (labelAdm) labelAdm.className = "flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition border-slate-200";
    if (userInp) userInp.value = 'carlos.ramirez@vallehermoso.mx';
    if (passInp) passInp.value = 'Residente123!';
  } else {
    if (labelRes) labelRes.className = "flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition border-slate-200";
    if (labelAdm) labelAdm.className = "flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition border-brand-500 bg-brand-50/50";
    if (userInp) userInp.value = 'admin@vallehermoso.mx';
    if (passInp) passInp.value = 'Admin123!';
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const feedback = document.getElementById('login-feedback');
  const submitBtn = document.getElementById('btn-login-submit');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Autenticando con JWT...`;
  }

  // 1. Intentar autenticación real contra la API REST
  if (window.VHApi) {
    const isOnline = await window.VHApi.healthCheck();
    if (isOnline) {
      const res = await window.VHApi.login(username, password);

      if (res.success) {
        const rol = res.usuario.rol;
        const targetRole = (rol === 'Administrador') ? 'admin' : 'resident';

        if (feedback) {
          feedback.className = "text-xs p-3 rounded-xl border bg-emerald-50 text-emerald-800 border-emerald-200 block";
          feedback.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i> <strong>¡Sesión iniciada con éxito!</strong> Token JWT emitido para ${res.usuario.nombre}.`;
        }

        setTimeout(async () => {
          closeLoginModal();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
          switchRole(targetRole);
          await syncBackendData();
        }, 600);
        return;
      } else {
        if (feedback) {
          feedback.className = "text-xs p-3 rounded-xl border bg-rose-50 text-rose-800 border-rose-200 block";
          feedback.innerHTML = `<i class="fa-solid fa-circle-exclamation text-rose-600 mr-1"></i> <strong>Error:</strong> ${res.error || 'Credenciales inválidas en Supabase.'}`;
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
        return;
      }
    }
  }

  // 2. Fallback offline si el servidor no está corriendo
  const selectedRole = document.querySelector('input[name="login-role"]:checked').value;
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
  closeLoginModal();
  switchRole(selectedRole);
}

async function loginAsResident() {
  handleLoginRoleChange('resident');
  if (window.VHApi && await window.VHApi.healthCheck()) {
    const res = await window.VHApi.login('carlos.ramirez@vallehermoso.mx', 'Residente123!');
    if (res.success) {
      switchRole('resident');
      await syncBackendData();
      return;
    }
  }
  switchRole('resident');
}

async function loginAsAdmin() {
  handleLoginRoleChange('admin');
  if (window.VHApi && await window.VHApi.healthCheck()) {
    const res = await window.VHApi.login('admin@vallehermoso.mx', 'Admin123!');
    if (res.success) {
      switchRole('admin');
      await syncBackendData();
      return;
    }
  }
  switchRole('admin');
}

// Sincronización bidireccional de datos con Supabase
async function syncBackendData() {
  if (!window.VHApi) return;

  try {
    // 1. Obtener cuotas reales de Supabase para el residente 2 (Carlos Ramírez)
    const cuotasBD = await window.VHApi.getCuotasByResidente(2);
    if (cuotasBD && cuotasBD.length > 0) {
      appState.residentFees = cuotasBD.map((c, index) => ({
        id: `fee-db-${c.id_cuota}`,
        backendId: c.id_cuota,
        concept: index === 0 ? 'Mantenimiento Mensual Ordinario' : `Cuota de Mantenimiento #${c.id_cuota}`,
        period: index === 0 ? 'Octubre 2026' : (index === 1 ? 'Septiembre 2026' : 'Periodo Ordinario'),
        amount: Number(c.monto),
        dueDate: '2026-10-10',
        status: c.estado === 'Pagado' ? 'paid' : (c.estado === 'Pendiente' ? 'pending' : 'under_review'),
        type: 'ordinaria',
        description: 'Vigilancia 24/7, alumbrado público y mantenimiento (Sincronizado con Supabase)'
      }));

      saveState();
      if (appState.currentRole === 'resident') {
        renderResidentView();
      }
    }

    // 2. Obtener pagos reales de Supabase
    const pagosBD = await window.VHApi.getPagosByResidente(2);
    if (pagosBD && pagosBD.length > 0) {
      const mappedPayments = pagosBD.map(p => ({
        id: `pay-db-${p.id_pago}`,
        folio: `VH-2026-0${p.id_pago + 100}`,
        lot: 14,
        resident: 'Carlos Ramírez Morales',
        concept: `Liquidación de Cuota #${p.id_cuota}`,
        amount: Number(p.monto),
        method: 'Tarjeta / SPEI (Registrado en BD)',
        date: p.fecha ? p.fecha.replace('T', ' ').slice(0, 16) : '2026-10-13 12:00',
        status: 'Aprobado',
        ref: `TXN-DB-${p.id_pago}`,
        seal: `SHA256:supabase_pago_${p.id_pago}`
      }));

      mappedPayments.forEach(mp => {
        if (!appState.payments.some(p => p.id === mp.id)) {
          appState.payments.unshift(mp);
        }
      });

      saveState();
      if (appState.currentRole === 'resident') {
        renderResidentHistory();
      }
    }
  } catch (err) {
    console.warn('[SYNC ERROR] No se pudo sincronizar datos con Supabase:', err);
  }
}

// ================= VISTA RESIDENTE =================
function switchResidentTab(tabId) {
  document.getElementById('resident-tab-cuotas').classList.add('hidden');
  document.getElementById('resident-tab-historial').classList.add('hidden');
  document.getElementById('resident-tab-facturacion').classList.add('hidden');

  document.querySelectorAll('.resident-tab-btn').forEach(btn => {
    btn.classList.remove('active-tab');
    btn.classList.add('text-slate-500');
    btn.classList.remove('text-brand-600');
  });

  document.getElementById(`resident-tab-${tabId}`).classList.remove('hidden');
  const activeBtn = document.getElementById(`tab-btn-${tabId}`);
  activeBtn.classList.add('active-tab');
  activeBtn.classList.add('text-brand-600');
  activeBtn.classList.remove('text-slate-500');
}

function renderResidentView() {
  const container = document.getElementById('resident-fees-container');
  container.innerHTML = '';

  let totalPending = 0;
  let countPending = 0;

  appState.residentFees.forEach(fee => {
    if (fee.status === 'pending') {
      totalPending += fee.amount;
      countPending++;
    }

    const card = document.createElement('div');
    card.className = "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition relative flex flex-col justify-between";

    let badgeHTML = '';
    let actionHTML = '';

    if (fee.status === 'pending') {
      badgeHTML = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200"><i class="fa-regular fa-clock mr-1"></i> Pendiente de Pago</span>`;
      actionHTML = `
        <button onclick="openPaymentModal('${fee.id}')" class="w-full mt-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/20 transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-credit-card"></i> Pagar Cuota Ahora
        </button>
      `;
    } else if (fee.status === 'under_review') {
      badgeHTML = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200"><i class="fa-solid fa-spinner fa-spin mr-1"></i> En Conciliación SPEI</span>`;
      actionHTML = `
        <div class="mt-4 p-2.5 bg-sky-50 rounded-xl text-[11px] text-sky-700 border border-sky-200 text-center font-medium">
          <i class="fa-solid fa-circle-info mr-1"></i> Transferencia en revisión por Administración.
        </div>
      `;
    } else if (fee.status === 'paid') {
      badgeHTML = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-brand-800 border border-emerald-200"><i class="fa-solid fa-check mr-1"></i> Liquidada</span>`;
      actionHTML = `
        <button onclick="showOfficialReceipt('${fee.folio || 'VH-2026-0715'}')" class="w-full mt-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-file-invoice text-brand-600"></i> Ver Recibo Digital
        </button>
      `;
    }

    card.innerHTML = `
      <div>
        <div class="flex justify-between items-start mb-3">
          ${badgeHTML}
          <span class="text-[11px] text-slate-400 font-medium">Vencimiento: ${fee.dueDate}</span>
        </div>
        <h4 class="font-bold text-slate-900 text-base mb-1">${fee.concept}</h4>
        <p class="text-xs text-slate-500 mb-3">${fee.description}</p>
        <div class="text-2xl font-black text-slate-900 mb-1">$${fee.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span class="text-xs font-semibold text-slate-400">MXN</span></div>
        <div class="text-[11px] text-slate-500">Periodo: <strong class="text-slate-700">${fee.period}</strong></div>
      </div>
      <div>
        ${actionHTML}
      </div>
    `;
    container.appendChild(card);
  });

  // Actualizar banner de saldo
  const balanceBadge = document.getElementById('resident-balance-badge');
  balanceBadge.textContent = `$${totalPending.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  if (totalPending === 0) {
    balanceBadge.className = "text-2xl font-black text-emerald-300";
    balanceBadge.parentElement.querySelector('span:last-child').textContent = 'Al corriente, ¡gracias por tu puntualidad!';
  } else {
    balanceBadge.className = "text-2xl font-black text-amber-300";
    balanceBadge.parentElement.querySelector('span:last-child').textContent = `${countPending} cuota(s) por liquidar`;
  }

  // Renderizar tabla de historial
  renderResidentHistory();
}

function renderResidentHistory() {
  const tbody = document.getElementById('resident-history-table-body');
  tbody.innerHTML = '';

  const myPayments = appState.payments.filter(p => p.lot === appState.activeResidentLot);

  if (myPayments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-slate-400">No se registran pagos previos.</td></tr>`;
    return;
  }

  myPayments.forEach(p => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition";
    tr.innerHTML = `
      <td class="p-3 font-mono font-bold text-brand-700">${p.folio}</td>
      <td class="p-3 text-slate-600">${p.date}</td>
      <td class="p-3 font-medium text-slate-800">${p.concept}</td>
      <td class="p-3 text-slate-600">${p.method}</td>
      <td class="p-3 font-bold text-slate-900">$${p.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
          ${p.status}
        </span>
      </td>
      <td class="p-3 text-center">
        ${p.status === 'Aprobado' ? `
          <button onclick="showOfficialReceipt('${p.folio}')" class="px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 rounded-lg text-[11px] font-semibold transition">
            <i class="fa-solid fa-receipt mr-1"></i> Recibo
          </button>
        ` : `<span class="text-slate-400 text-[10px]">En proceso</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ================= PASARELA DE PAGO INTERACTIVA =================
let selectedFeeForPayment = null;

function openPaymentModal(feeId) {
  selectedFeeForPayment = appState.residentFees.find(f => f.id === feeId);
  if (!selectedFeeForPayment) return;

  document.getElementById('pay-fee-concept').textContent = selectedFeeForPayment.concept;
  document.getElementById('pay-fee-amount').textContent = `$${selectedFeeForPayment.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  document.getElementById('btn-card-amount').textContent = `$${selectedFeeForPayment.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  document.getElementById('pay-fee-period').textContent = selectedFeeForPayment.period;
  document.getElementById('pay-fee-lot').textContent = `Lote ${appState.activeResidentLot}`;

  // Referencia única SPEI
  const cleanPeriod = selectedFeeForPayment.period.replace(/\s+/g, '').toUpperCase();
  document.getElementById('spei-unique-ref').textContent = `VH-L${appState.activeResidentLot}-${cleanPeriod.slice(0, 6)}`;

  selectPaymentMethod('card');
  document.getElementById('modal-payment').classList.remove('hidden');
}

function closePaymentModal() {
  document.getElementById('modal-payment').classList.add('hidden');
}

function selectPaymentMethod(method) {
  const btnCard = document.getElementById('btn-method-card');
  const btnSpei = document.getElementById('btn-method-spei');
  const formCard = document.getElementById('form-pay-card');
  const formSpei = document.getElementById('form-pay-spei');

  if (method === 'card') {
    btnCard.className = "payment-method-btn p-3.5 rounded-2xl border-2 border-brand-500 bg-brand-50/50 flex flex-col items-center gap-1.5 transition";
    btnSpei.className = "payment-method-btn p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-300 flex flex-col items-center gap-1.5 transition";
    formCard.classList.remove('hidden');
    formSpei.classList.add('hidden');
  } else {
    btnCard.className = "payment-method-btn p-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-300 flex flex-col items-center gap-1.5 transition";
    btnSpei.className = "payment-method-btn p-3.5 rounded-2xl border-2 border-accent-500 bg-sky-50/50 flex flex-col items-center gap-1.5 transition";
    formCard.classList.add('hidden');
    formSpei.classList.remove('hidden');
  }
}

// Procesar Pago con Tarjeta (Simulación realista)
function processCardPayment(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-card');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Comunicando con pasarela segura...`;

  setTimeout(() => {
    // Generar Folio Oficial
    const randomFolio = `VH-2026-0${Math.floor(100 + Math.random() * 899)}`;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    // Actualizar Cuota
    selectedFeeForPayment.status = 'paid';
    selectedFeeForPayment.folio = randomFolio;
    selectedFeeForPayment.paymentDate = dateStr;
    selectedFeeForPayment.method = 'Tarjeta de Débito (Visa *4242)';

    // Actualizar Saldo del Lote en el Directorio
    const res = appState.residents.find(r => r.lot === appState.activeResidentLot);
    if (res) {
      res.balance = Math.max(0, res.balance - selectedFeeForPayment.amount);
      if (res.balance === 0) res.status = 'al_corriente';
    }

    // Registrar en Pagos Generales
    appState.payments.unshift({
      id: 'pay-' + Date.now(),
      folio: randomFolio,
      lot: appState.activeResidentLot,
      resident: 'Carlos Ramírez Morales',
      concept: `${selectedFeeForPayment.concept} - ${selectedFeeForPayment.period}`,
      amount: selectedFeeForPayment.amount,
      method: 'Tarjeta de Débito (Visa *4242)',
      date: dateStr,
      status: 'Aprobado',
      ref: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      seal: 'SHA256:' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
    });

    // Registrar en Auditoría
    appState.auditLogs.unshift({
      timestamp: dateStr,
      user: 'carlos.ramirez@vallehermoso.mx',
      action: `Pago confirmado con tarjeta de ${selectedFeeForPayment.concept} ($${selectedFeeForPayment.amount} MXN) - Folio ${randomFolio}`
    });

    // Registrar en Supabase vía API REST con JWT
    if (window.VHApi && window.VHApi.isAuthenticated()) {
      const cuotaId = selectedFeeForPayment.backendId || 2;
      window.VHApi.registrarPago(cuotaId, selectedFeeForPayment.amount)
        .then(res => {
          if (res.success) {
            console.log('✅ Pago asentado en Supabase (tabla pagos) y cuota liquidada:', res.data);
          }
        })
        .catch(err => console.error('Error registrando pago en Supabase:', err));
    }

    saveState();

    btn.disabled = false;
    btn.innerHTML = originalText;
    closePaymentModal();

    // Animación de Confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    renderResidentView();
    showOfficialReceipt(randomFolio);
  }, 1200);
}

// Simular Carga de Comprobante SPEI
let simulatedFileUploaded = false;
function simulateFileUpload() {
  simulatedFileUploaded = true;
  const status = document.getElementById('upload-status-text');
  status.innerHTML = `<span class="text-emerald-700 font-bold"><i class="fa-solid fa-file-circle-check"></i> comprobante_spei_bbva_111026.pdf adjuntado</span>`;
}

// Reportar Transferencia SPEI para Conciliación
function submitSpeiTransfer() {
  const ref = document.getElementById('spei-unique-ref').textContent;
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const randomFolio = `VH-2026-0${Math.floor(100 + Math.random() * 899)}`;

  selectedFeeForPayment.status = 'under_review';
  selectedFeeForPayment.folio = randomFolio;
  selectedFeeForPayment.method = 'Transferencia SPEI';

  appState.payments.unshift({
    id: 'pay-' + Date.now(),
    folio: randomFolio,
    lot: appState.activeResidentLot,
    resident: 'Carlos Ramírez Morales',
    concept: `${selectedFeeForPayment.concept} - ${selectedFeeForPayment.period}`,
    amount: selectedFeeForPayment.amount,
    method: 'Transferencia SPEI',
    date: dateStr,
    status: 'Por Conciliar',
    ref: ref,
    receiptFile: simulatedFileUploaded ? 'comprobante_spei_bbva_111026.pdf' : 'captura_transferencia_spei.pdf'
  });

  appState.auditLogs.unshift({
    timestamp: dateStr,
    user: 'carlos.ramirez@vallehermoso.mx',
    action: `Transferencia SPEI reportada para conciliación (${selectedFeeForPayment.concept}) - Ref ${ref}`
  });

  saveState();
  closePaymentModal();
  renderResidentView();

  alert(`¡Transferencia reportada exitosamente!\nReferencia: ${ref}\nLa Mesa Directiva validará el comprobante bancario para actualizar tu estado de cuenta.`);
}

// ================= COMPROBANTE OFICIAL Y QR =================
function showOfficialReceipt(folio) {
  const payment = appState.payments.find(p => p.folio === folio);
  if (!payment) return;

  document.getElementById('rec-folio').textContent = payment.folio;
  document.getElementById('rec-resident').textContent = payment.resident || 'Carlos Ramírez Morales';
  document.getElementById('rec-lot').textContent = `Lote ${payment.lot} • Fracc. Valle Hermoso`;
  document.getElementById('rec-date').textContent = payment.date;
  document.getElementById('rec-method').textContent = payment.method;
  document.getElementById('rec-concept').textContent = payment.concept;
  document.getElementById('rec-subtotal').textContent = `$${payment.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  document.getElementById('rec-total').textContent = `$${payment.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;

  const seal = payment.seal || ('SHA256:' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2));
  document.getElementById('rec-digital-seal').textContent = `||VH|${payment.folio}|${payment.amount}|LOTE${payment.lot}|${seal}||`;

  // Generar Código QR Dinámico
  const qrContainer = document.getElementById('qrcode-container');
  qrContainer.innerHTML = '';
  if (typeof QRCode !== 'undefined') {
    new QRCode(qrContainer, {
      text: `https://vallehermoso.mx/validar?folio=${payment.folio}&monto=${payment.amount}&lote=${payment.lot}`,
      width: 70,
      height: 70,
      colorDark : "#064e3b",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.M
    });
  }

  document.getElementById('modal-receipt').classList.remove('hidden');
}

function closeReceiptModal() {
  document.getElementById('modal-receipt').classList.add('hidden');
}

function printReceipt() {
  window.print();
}

// Facturación CFDI
function handleCfdiSubmit(e) {
  e.preventDefault();
  appState.taxProfile = {
    rfc: document.getElementById('cfdi-rfc').value,
    name: document.getElementById('cfdi-name').value,
    regimen: document.getElementById('cfdi-regimen').value,
    uso: document.getElementById('cfdi-uso').value,
    cp: document.getElementById('cfdi-cp').value,
    email: document.getElementById('cfdi-email').value,
  };
  saveState();
  alert('Datos fiscales guardados con éxito. Se vincularán a tus futuros pagos para emisión de comprobante fiscal.');
}

// ================= VISTA ADMINISTRADOR =================
function switchAdminTab(tabId) {
  document.getElementById('admin-tab-conciliacion').classList.add('hidden');
  document.getElementById('admin-tab-residentes').classList.add('hidden');
  document.getElementById('admin-tab-egresos').classList.add('hidden');
  document.getElementById('admin-tab-reportes').classList.add('hidden');
  document.getElementById('admin-tab-auditoria').classList.add('hidden');

  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.remove('active-tab');
    btn.classList.add('text-slate-500');
    btn.classList.remove('text-brand-600');
  });

  document.getElementById(`admin-tab-${tabId}`).classList.remove('hidden');
  const activeBtn = document.getElementById(`adm-tab-${tabId}`);
  activeBtn.classList.add('active-tab');
  activeBtn.classList.add('text-brand-600');
  activeBtn.classList.remove('text-slate-500');

  if (tabId === 'reportes') {
    renderCharts();
  }
}

function renderAdminView() {
  // Calcular KPIs
  const totalRecaudado = appState.payments
    .filter(p => p.status === 'Aprobado')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalMorosidad = appState.residents.reduce((sum, r) => sum + r.balance, 0);
  const pendientesCount = appState.payments.filter(p => p.status === 'Por Conciliar').length;
  const totalEgresos = appState.expenses.reduce((sum, e) => sum + e.amount, 0);

  document.getElementById('kpi-recaudacion').textContent = `$${totalRecaudado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  document.getElementById('kpi-morosidad').textContent = `$${totalMorosidad.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  document.getElementById('kpi-pendientes').textContent = pendientesCount;
  document.getElementById('kpi-egresos').textContent = `$${totalEgresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  document.getElementById('badge-pendientes-count').textContent = pendientesCount;

  // Renderizar Bandeja de Conciliación
  renderPendingPayments();

  // Renderizar Residentes
  renderResidentsList(appState.residents);

  // Renderizar Egresos
  renderExpensesList();

  // Renderizar Auditoría
  renderAuditLogs();
}

function renderPendingPayments() {
  const tbody = document.getElementById('admin-pending-table-body');
  tbody.innerHTML = '';

  const pendings = appState.payments.filter(p => p.status === 'Por Conciliar');

  if (pendings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400 font-medium"><i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i> No hay pagos pendientes por conciliar. Todos los registros están al día.</td></tr>`;
    return;
  }

  pendings.forEach(p => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition";
    tr.innerHTML = `
      <td class="p-3 font-mono font-bold text-slate-800">${p.ref}</td>
      <td class="p-3 font-medium text-slate-900">${p.resident} <span class="text-xs text-slate-500">(Lote ${p.lot})</span></td>
      <td class="p-3 text-slate-600">${p.concept}</td>
      <td class="p-3 text-slate-500">${p.date}</td>
      <td class="p-3 font-bold text-slate-900">$${p.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
      <td class="p-3">
        <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <i class="fa-solid fa-file-pdf"></i> ${p.receiptFile || 'comprobante_spei.pdf'}
        </span>
      </td>
      <td class="p-3 text-center">
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="approvePayment('${p.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] shadow-xs transition" title="Aprobar y generar recibo">
            <i class="fa-solid fa-check"></i> Aprobar
          </button>
          <button onclick="rejectPayment('${p.id}')" class="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg font-bold text-[11px] transition" title="Rechazar con nota">
            <i class="fa-solid fa-xmark"></i> Rechazar
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function approvePayment(payId) {
  const payment = appState.payments.find(p => p.id === payId);
  if (!payment) return;

  payment.status = 'Aprobado';
  payment.seal = 'SHA256:' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

  // Si es del residente 14, actualizar su fee
  if (payment.lot === appState.activeResidentLot) {
    const fee = appState.residentFees.find(f => f.status === 'under_review');
    if (fee) {
      fee.status = 'paid';
      fee.folio = payment.folio;
      fee.paymentDate = payment.date;
    }
  }

  // Actualizar saldo del lote
  const res = appState.residents.find(r => r.lot === payment.lot);
  if (res) {
    res.balance = Math.max(0, res.balance - payment.amount);
    if (res.balance === 0) res.status = 'al_corriente';
  }

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  appState.auditLogs.unshift({
    timestamp: dateStr,
    user: 'admin@vallehermoso.mx',
    action: `Conciliación aprobada: Pago SPEI Lote ${payment.lot} ($${payment.amount} MXN) - Folio ${payment.folio}`
  });

  // Registrar en Supabase vía API REST con JWT
  if (window.VHApi && window.VHApi.isAuthenticated()) {
    const fee = appState.residentFees.find(f => f.status === 'paid' && f.backendId);
    const cuotaId = (fee && fee.backendId) ? fee.backendId : 2;
    window.VHApi.registrarPago(cuotaId, payment.amount)
      .then(res => console.log('✅ Conciliación registrada en Supabase:', res))
      .catch(err => console.error('Error registrando conciliación en backend:', err));
  }

  saveState();
  renderAdminView();
  alert(`Pago ${payment.folio} aprobado exitosamente. Se ha actualizado el estado de cuenta del Lote ${payment.lot}.`);
}

function rejectPayment(payId) {
  const reason = prompt('Indica el motivo del rechazo del comprobante (ej. Monto incompleto, referencia incorrecta):', 'Monto no coincide con el estado de cuenta');
  if (!reason) return;

  const payment = appState.payments.find(p => p.id === payId);
  if (!payment) return;

  payment.status = 'Rechazado';

  if (payment.lot === appState.activeResidentLot) {
    const fee = appState.residentFees.find(f => f.status === 'under_review');
    if (fee) fee.status = 'pending';
  }

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  appState.auditLogs.unshift({
    timestamp: dateStr,
    user: 'admin@vallehermoso.mx',
    action: `Transferencia rechazada para Lote ${payment.lot}: "${reason}"`
  });

  saveState();
  renderAdminView();
}

// Directorio de Residentes
function renderResidentsList(list) {
  const tbody = document.getElementById('admin-residents-table-body');
  tbody.innerHTML = '';

  list.forEach(r => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition";
    tr.innerHTML = `
      <td class="p-3 font-bold text-slate-900">Lote ${r.lot}</td>
      <td class="p-3 text-slate-600">${r.street}</td>
      <td class="p-3 font-semibold text-slate-800">${r.name}</td>
      <td class="p-3 text-slate-500">${r.phone}<br><span class="text-[10px] text-slate-400">${r.email}</span></td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${r.balance === 0 ? 'bg-emerald-100 text-brand-800' : 'bg-rose-100 text-rose-800'}">
          ${r.balance === 0 ? 'Al Corriente' : 'Con Adeudo'}
        </span>
      </td>
      <td class="p-3 font-bold ${r.balance === 0 ? 'text-slate-400' : 'text-rose-600'}">
        $${r.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
      </td>
      <td class="p-3 text-center">
        <button onclick="viewResidentDetail(${r.lot})" class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold">
          <i class="fa-solid fa-eye"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterResidents(query) {
  const q = query.toLowerCase();
  const filtered = appState.residents.filter(r => 
    r.name.toLowerCase().includes(q) || 
    r.street.toLowerCase().includes(q) || 
    `lote ${r.lot}`.includes(q)
  );
  renderResidentsList(filtered);
}

function viewResidentDetail(lotNum) {
  const res = appState.residents.find(r => r.lot === lotNum);
  if (!res) return;
  alert(`Detalle del Residente:\nLote: ${res.lot}\nPropietario: ${res.name}\nDirección: ${res.street}\nTeléfono: ${res.phone}\nCorreo: ${res.email}\nSaldo Actual: $${res.balance.toFixed(2)} MXN`);
}

// Egresos
function renderExpensesList() {
  const tbody = document.getElementById('admin-expenses-table-body');
  tbody.innerHTML = '';

  appState.expenses.forEach(e => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition";
    tr.innerHTML = `
      <td class="p-3 text-slate-500">${e.date}</td>
      <td class="p-3 font-semibold text-slate-700"><span class="px-2 py-0.5 bg-slate-100 rounded text-[11px]">${e.category}</span></td>
      <td class="p-3 text-slate-800">${e.concept}</td>
      <td class="p-3 text-slate-600">${e.vendor}</td>
      <td class="p-3 font-bold text-slate-900">$${e.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
      <td class="p-3 text-slate-500 text-[11px]">${e.approvedBy}</td>
    `;
    tbody.appendChild(tr);
  });
}

function openNewExpenseModal() {
  document.getElementById('modal-new-expense').classList.remove('hidden');
}

function closeNewExpenseModal() {
  document.getElementById('modal-new-expense').classList.add('hidden');
}

function handleCreateExpenseSubmit(e) {
  e.preventDefault();
  const category = document.getElementById('exp-category').value;
  const concept = document.getElementById('exp-concept').value;
  const vendor = document.getElementById('exp-vendor').value;
  const amount = parseFloat(document.getElementById('exp-amount').value);

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

  appState.expenses.unshift({
    id: 'exp-' + Date.now(),
    date: dateStr,
    category,
    concept,
    vendor,
    amount,
    approvedBy: 'Mesa Directiva'
  });

  appState.auditLogs.unshift({
    timestamp: `${dateStr} 12:00`,
    user: 'admin@vallehermoso.mx',
    action: `Egreso registrado: ${concept} ($${amount} MXN) a favor de ${vendor}`
  });

  saveState();
  closeNewExpenseModal();
  renderAdminView();
  alert('Egreso registrado exitosamente en el libro financiero.');
}

// Nueva Cuota General
function openNewFeeModal() {
  document.getElementById('modal-new-fee').classList.remove('hidden');
}

function closeNewFeeModal() {
  document.getElementById('modal-new-fee').classList.add('hidden');
}

function handleCreateFeeSubmit(e) {
  e.preventDefault();
  const concept = document.getElementById('new-fee-concept').value;
  const amount = parseFloat(document.getElementById('new-fee-amount').value);
  const period = document.getElementById('new-fee-period').value;
  const dueDate = document.getElementById('new-fee-due').value;

  // Aplicar saldo a todos los 25 lotes
  appState.residents.forEach(r => {
    r.balance += amount;
    r.status = 'adeudo';
  });

  // Agregar a las cuotas del residente 14
  appState.residentFees.unshift({
    id: 'fee-' + Date.now(),
    concept,
    period,
    amount,
    dueDate,
    status: 'pending',
    type: 'extraordinaria',
    description: `Cuota aprobada en Asamblea General para el fraccionamiento.`
  });

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  appState.auditLogs.unshift({
    timestamp: dateStr,
    user: 'admin@vallehermoso.mx',
    action: `Emisión de cuota general: "${concept}" por $${amount} MXN aplicada a 25 lotes.`
  });

  // Si está autenticado en la API REST, persistir en Supabase
  if (window.VHApi && window.VHApi.isAuthenticated()) {
    window.VHApi.createCuota(2, amount, 'Pendiente')
      .then(res => {
        if (res.success) {
          console.log('✅ Nueva cuota persistida en Supabase:', res.data);
        }
      })
      .catch(err => console.error('Error creando cuota en Supabase:', err));
  }

  saveState();
  closeNewFeeModal();
  renderAdminView();
  alert(`Cuota de "${concept}" emitida exitosamente a los 25 lotes del padrón.`);
}

// Auditoría
function renderAuditLogs() {
  const container = document.getElementById('audit-logs-container');
  container.innerHTML = '';

  appState.auditLogs.forEach(log => {
    const item = document.createElement('div');
    item.className = "p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3";
    item.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
        <i class="fa-solid fa-clock"></i>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-slate-800">${log.user}</span>
          <span class="text-[10px] text-slate-400 font-mono">${log.timestamp}</span>
        </div>
        <p class="text-slate-600 mt-0.5 text-xs">${log.action}</p>
      </div>
    `;
    container.appendChild(item);
  });
}

// Gráficas Financieras con Chart.js
let financeChartInstance = null;
let expenseChartInstance = null;

function renderCharts() {
  if (typeof Chart === 'undefined') return;

  // Gráfico 1: Ingresos vs Egresos
  const ctxFinance = document.getElementById('financeChart');
  if (ctxFinance) {
    if (financeChartInstance) financeChartInstance.destroy();
    financeChartInstance = new Chart(ctxFinance, {
      type: 'bar',
      data: {
        labels: ['Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'],
        datasets: [
          {
            label: 'Ingresos por Cuotas ($ MXN)',
            data: [26400, 28800, 27600, 31200, 25200, 21600],
            backgroundColor: '#10b981',
            borderRadius: 6
          },
          {
            label: 'Egresos Operativos ($ MXN)',
            data: [15200, 16400, 14900, 22100, 16000, 14250],
            backgroundColor: '#ef4444',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // Gráfico 2: Distribución de Egresos
  const ctxExpense = document.getElementById('expenseChart');
  if (ctxExpense) {
    if (expenseChartInstance) expenseChartInstance.destroy();
    expenseChartInstance = new Chart(ctxExpense, {
      type: 'doughnut',
      data: {
        labels: ['Seguridad Caseta', 'CFE y Alumbrado', 'Jardinería Áreas Verdes', 'Administración'],
        datasets: [{
          data: [6500, 2850, 3100, 1800],
          backgroundColor: ['#0f766e', '#0284c7', '#10b981', '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

// Exportar Datos a CSV (Compatible con Excel)
function exportToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "REPORTE FINANCIERO Y AUDITORIA - FRACCIONAMIENTO VALLE HERMOSO\r\n";
  csvContent += "Generado el: " + new Date().toLocaleString() + "\r\n\r\n";
  
  csvContent += "=== PADRON DE RESIDENTES ===\r\n";
  csvContent += "Lote,Direccion,Propietario,Telefono,Correo,Estado,Saldo\r\n";
  appState.residents.forEach(r => {
    csvContent += `${r.lot},"${r.street}","${r.name}",${r.phone},${r.email},${r.status},${r.balance}\r\n`;
  });

  csvContent += "\r\n=== HISTORIAL DE PAGOS ===\r\n";
  csvContent += "Folio,Lote,Residente,Concepto,Monto,Metodo,Fecha,Estado,Referencia\r\n";
  appState.payments.forEach(p => {
    csvContent += `"${p.folio}",${p.lot},"${p.resident}","${p.concept}",${p.amount},"${p.method}","${p.date}","${p.status}","${p.ref || ''}"\r\n`;
  });

  csvContent += "\r\n=== HISTORIAL DE EGRESOS ===\r\n";
  csvContent += "Fecha,Categoria,Concepto,Proveedor,Monto,AprobadoPor\r\n";
  appState.expenses.forEach(e => {
    csvContent += `"${e.date}","${e.category}","${e.concept}","${e.vendor}",${e.amount},"${e.approvedBy}"\r\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `reporte_financiero_valle_hermoso_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Inicializar al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});
