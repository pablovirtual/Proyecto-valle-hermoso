# Sistema Web de Pagos para el Fraccionamiento Valle Hermoso

[![GitHub Pages](https://img.shields.io/badge/Demo_en_Vivo-GitHub_Pages-059669?style=for-the-badge&logo=github)](https://pablovirtual.github.io/Proyecto-valle-hermoso/)
[![Backend Status](https://img.shields.io/badge/API_REST-Node.js_+_Supabase_+_JWT-0284c7?style=for-the-badge&logo=node.js)](backend/)
[![Pruebas](https://img.shields.io/badge/Pruebas_Integrales-9%2F9_Pasadas_(100%25)-10b981?style=for-the-badge)](backend/test-api.js)

**Plataforma Integral de Servicios Web y Control Financiero**  
*Universidad de Guadalajara — UDG Virtual*  
- **Estudiante y Desarrollador:** Pedro Pablo Rodríguez Gómez  
- **Proyecto VI / VII:** Mtra. Úrsula del Pilar González Robles  
- **Tendencias en Diseños de Servicios (Actividad 3):** Mtro. Oscar Gregorio Silva Mares  

🌐 **Acceso Directo en Línea (Demo GitHub Pages):**  
👉 **[https://pablovirtual.github.io/Proyecto-valle-hermoso/](https://pablovirtual.github.io/Proyecto-valle-hermoso/)**

---

## 📌 Contexto y Propuesta de Solución

En el **Fraccionamiento Valle Hermoso**, la administración vecinal controlaba cuotas y pagos mediante canales dispersos y hojas de cálculo desconectadas, ocasionando morosidad, comprobantes extraviados y falta de transparencia.

La solución es una **Infraestructura de Servicios Web Integral** compuesta por:
1. **Frontend SPA Interactivo:** Portal para residentes y panel administrativo para la mesa directiva con pagos con tarjeta, referencias SPEI y recibos digitales con código QR.
2. **Backend API REST Modular (Patrón MVC):** Servidor en **Node.js** y **Express** con persistencia en **Supabase (PostgreSQL)** y autenticación mediante **JSON Web Tokens (JWT)**.
3. **Capa de Integración en Tiempo Real (`api-service.js`):** Comunicación asíncrona entre cliente y servidor con tolerancia a fallos (*Offline Fallback* en `LocalStorage` cuando el servidor no esté en ejecución).

---

## 🏗️ Arquitectura de la Solución (End-to-End)

```
┌────────────────────────────────────────────────────────┐
│                   FRONTEND (SPA Web)                   │
│   index.html + app.js + styles.css + Tailwind + QR     │
└───────────────────────────┬────────────────────────────┘
                            │ Fetch HTTP + JWT (sessionStorage)
                            ▼
┌────────────────────────────────────────────────────────┐
│               CAPA DE SERVICIO CLIENTE                 │
│                     api-service.js                     │
└───────────────────────────┬────────────────────────────┘
                            │ REST JSON (Bearer Token)
                            ▼
┌────────────────────────────────────────────────────────┐
│             BACKEND API REST (Express / MVC)           │
│   ├── routes/ (auth, cuotas, pagos)                    │
│   ├── middlewares/auth.js (Verificador JWT / RBAC)     │
│   └── controllers/ (auth, cuotas, pagos)               │
└───────────────────────────┬────────────────────────────┘
                            │ @supabase/supabase-js
                            ▼
┌────────────────────────────────────────────────────────┐
│           BASE DE DATOS NUBE (Supabase BaaS)           │
│   PostgreSQL: Tablas residentes, cuotas, pagos + RLS   │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Módulos y Funcionalidades del Sistema

### 1. 🌐 Portal Público / Landing Page y Registro de Residentes
- **Información del Fraccionamiento:** Cuota mensual vigente ($1,200 MXN), proyectos comunes y avisos fiscales.
- **Registro de Nuevos Residentes (`POST /api/auth/register`):**
  - Formulario intuitivo con pestañas dinámicas en el modal de autenticación (*Iniciar Sesión* y *Crear Cuenta*).
  - Captura y validación de nombre, correo, lote asignado y contraseña (mínimo 6 caracteres).
  - Persistencia segura en la tabla `residentes` de Supabase con contraseñas encriptadas mediante `bcrypt` (factor de coste 10).
  - Control de unicidad con respuesta `HTTP 409 Conflict` si el correo ya existe.
  - **Auto-login instantáneo:** emisión directa de token JWT tras el registro para acceso sin fricciones al portal.
- **Acceso Directo por Roles:** Botones diferenciados para **Residente** y **Mesa Directiva**.

### 2. 👤 Portal del Residente (Lote 14 - Carlos Ramírez)
- **Estado de Cuenta en Vivo:** Sincronizado en tiempo real con Supabase (`GET /api/cuotas?id_residente=2`).
- **Pasarela de Pago Transaccional:**
  - **Tarjeta de Débito/Crédito:** Validación interactiva, cumplimiento conceptual PCI DSS y registro directo en la tabla `pagos` de Supabase con `POST /api/pagos`.
  - **Transferencia SPEI:** Instrucciones interbancarias (BBVA), generación de referencia única alfanumérica (`VH-L14-202610`) y pase a bandeja de conciliación.
- **Comprobante Digital Oficial:**
  - Folio único institucional (ej. `VH-2026-0842`).
  - Sello digital criptográfico SHA-256.
  - **Código QR dinámico** con cadena de verificación.
  - Botón de imprimir y guardar en PDF.
- **Historial de Pagos:** Consulta de liquidaciones pasadas registradas en la base de datos.
- **Módulo de Facturación (CFDI 4.0):** Captura de RFC, Razón Social, Régimen Fiscal y Código Postal.

### 3. 🛡️ Panel Administrativo (Mesa Directiva)
- **Dashboard Ejecutivo:** KPIs en vivo (recaudación mensual, cartera vencida, pagos por conciliar y egresos).
- **Bandeja de Conciliación SPEI:** Aprobación de transferencias reportadas que liquida la cuota en Supabase de forma atómica.
- **Padrón Vecinal de 25 Lotes:** Directorio completo con estatus de cuota ("Al corriente" o "Con adeudo") y buscador interactivo.
- **Emisión de Cuotas Generales:** Creación de cuotas ordinarias o extraordinarias persistidas en la nube con `POST /api/cuotas`.
- **Libro de Egresos:** Registro de gastos operativos (seguridad caseta, CFE, jardinería).
- **Reportes Financieros:** Gráficas con **Chart.js** y exportación automática a formato **CSV / Excel**.
- **Bitácora de Auditoría:** Trazabilidad cronológica de acciones sensibles.

---

## 🔒 Capa de Seguridad (JSON Web Token - JWT)

Las operaciones transaccionales y mutadoras están protegidas por el middleware [`backend/middlewares/auth.js`](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/backend/middlewares/auth.js):

- **Login (`POST /api/auth/login`):** Valida credenciales contra la tabla `residentes` usando `bcryptjs` (salt rounds = 10) y emite un token JWT firmado válido por 8 horas.
- **Cabecera HTTP:** `Authorization: Bearer <token_jwt>` requerida en todas las operaciones de escritura.
- **Validaciones:**
  - Ausencia de token → `HTTP 401 Unauthorized`.
  - Token expirado → `HTTP 401 Unauthorized`.
  - Firma alterada o token corrupto → `HTTP 403 Forbidden`.
- **Control de Roles (RBAC):** Privilegios diferenciados entre `Residente` y `Administrador`.

---

## 🚀 Guía de Ejecución Rápida

### Opción A: Sistema Completo (Frontend + Backend API + Supabase)

1. **Iniciar el Backend (API REST en Node.js):**
   ```bash
   cd backend
   npm install
   npm start
   ```
   *El servidor arrancará en `http://localhost:3000` con la base de datos Supabase conectada.*

2. **Iniciar el Frontend:**
   - Haz doble clic en `start-prototype.bat` o ejecuta:
     ```bash
     python server.py
     ```
   - El navegador se abrirá automáticamente en `http://localhost:8080`.
   - En la barra superior verás el indicador **`🟢 API En Línea (Supabase)`**.

3. **Ejecutar Pruebas Automatizadas del Backend:**
   En otra terminal dentro de `backend/`:
   ```bash
   npm test
   ```
   *Ejecutará 7 pruebas de integración completas (Auth, Cuotas, Pagos, RLS y Seguridad).*

---

### Opción B: Modo Prototipo Ligero (Solo Frontend)

Si no deseas iniciar el backend de Node.js, el frontend cuenta con **tolerancia a fallos**:
- Abre directamente [`index.html`](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/index.html) en tu navegador (Chrome o Edge).
- La barra superior indicará `🟡 API Desconectada`, activando automáticamente la persistencia local en `LocalStorage`.

---

## 👥 Credenciales de Prueba

| Rol           | Correo                            | Contraseña      | Lote / Cargo   |
|---------------|-----------------------------------|-----------------|----------------|
| Administrador | `admin@vallehermoso.mx`           | `Admin123!`     | Mesa Directiva |
| Residente     | `carlos.ramirez@vallehermoso.mx`  | `Residente123!` | Lote 14        |

---

## 📂 Estructura General de Archivos

```text
Proyecto valle hermoso/
├── index.html                         # Interfaz gráfica principal (SPA en Tailwind)
├── api-service.js                     # Capa de servicio cliente para llamadas REST con JWT
├── app.js                             # Lógica de negocio y sincronización con Supabase
├── styles.css                         # Estilos personalizados y vista de impresión de recibos
├── server.py                          # Servidor HTTP local en Python
├── start-prototype.bat                # Lanzador en un clic para Windows
│
├── backend/                           # API REST (Actividad Integradora 3)
│   ├── config/db.js                   # Conexión al cliente de Supabase
│   ├── controllers/                   # Controladores MVC (auth, cuotas, pagos)
│   ├── middlewares/auth.js            # Capa de seguridad y verificación de tokens JWT
│   ├── routes/                        # Enrutadores modulares (/api/auth, /api/cuotas, /api/pagos)
│   ├── database.sql                   # Script DDL definitivo para Supabase (tablas, RLS y datos)
│   ├── test-api.js                    # Suite de 7 pruebas automatizadas de integración
│   ├── package.json                   # Dependencias de Node.js
│   ├── README.md                      # Documentación técnica completa del backend
│   └── .env                           # Credenciales seguras (URL y Key de Supabase)
│
└── .github/workflows/deploy.yml       # Despliegue continuo a GitHub Pages
```

---

## 📄 Licencia y Créditos

Proyecto desarrollado por **Pedro Pablo Rodríguez Gómez** para la **Universidad de Guadalajara (UDG Virtual)**, 2026.
