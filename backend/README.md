# API REST — Sistema Web de Pagos del Fraccionamiento Valle Hermoso

> **Actividad Integradora 3 — Infraestructura de Servicios**  
> Universidad de Guadalajara · UDG Virtual  
> **Materia:** Tendencias en Diseño de Servicios  
> **Estudiante:** Pedro Pablo Rodríguez Gómez  
> **Docente:** Oscar Gregorio Silva Mares  

API REST modular desarrollada con **Node.js 20+**, **Express 4**, **Supabase (PostgreSQL)** y autenticación mediante **JSON Web Tokens (JWT)**. Probada y verificada al 100 % con conexión real a la base de datos en la nube.

---

## ✅ Estado del Proyecto

| Componente               | Estado       |
|--------------------------|:------------:|
| Servidor Express         | ✅ Operativo |
| Conexión Supabase/PG     | ✅ Operativo |
| Encriptación bcrypt      | ✅ Operativo |
| Autenticación JWT        | ✅ Operativo |
| Middleware de seguridad  | ✅ Operativo |
| CRUD de Cuotas           | ✅ Operativo |
| Suite de pruebas         | ✅ 5/5 OK    |

---

## 📁 Estructura del Proyecto (Patrón MVC)

```text
backend/
├── config/
│   └── db.js                 # Instanciación y sanitización del cliente de Supabase
├── controllers/
│   ├── authController.js     # Login (bcrypt + JWT), registro con hash de contraseña
│   └── cuotasController.js   # Lógica CRUD completa: GET, POST, PUT, DELETE
├── middlewares/
│   └── auth.js               # verifyToken (JWT), authorizeRoles (RBAC)
├── routes/
│   ├── auth.js               # POST /api/auth/login, POST /api/auth/register
│   └── cuotas.js             # GET (público), POST/PUT/DELETE (protegido con JWT)
├── database.sql              # DDL definitivo: tablas, RLS, políticas y datos semilla
├── test-api.js               # Suite de pruebas automatizadas (5 pruebas de integración)
├── .env.example              # Plantilla de variables de entorno
├── .env                      # Variables de entorno reales (NO versionar)
├── index.js                  # Servidor Express principal (exporta app para pruebas)
└── package.json              # Dependencias y scripts (start, dev, test)
```

---

## 🗄️ Modelo de Datos (PostgreSQL en Supabase)

### Tablas relacionales

```sql
-- 1. Tabla: residentes
id_residente SERIAL PRIMARY KEY
nombre       VARCHAR(120) NOT NULL
correo       VARCHAR(120) UNIQUE NOT NULL
password     VARCHAR(255) NOT NULL          -- Almacenado como hash bcrypt (salt=10)
rol          VARCHAR(20)  DEFAULT 'Residente' CHECK (rol IN ('Residente', 'Administrador'))

-- 2. Tabla: cuotas  (FK → residentes)
id_cuota     SERIAL PRIMARY KEY
id_residente INT REFERENCES residentes ON DELETE CASCADE
monto        NUMERIC(10,2) CHECK (monto >= 0)
estado       VARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente','Pagado','Atrasado'))

-- 3. Tabla: pagos  (FK → cuotas)
id_pago      SERIAL PRIMARY KEY
id_cuota     INT REFERENCES cuotas ON DELETE CASCADE
monto        NUMERIC(10,2) CHECK (monto > 0)
fecha        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
```

### Características de la base de datos
- **Row Level Security (RLS)** habilitado con políticas de acceso configuradas.
- **Índices** en `correo`, `id_residente` e `id_cuota` para optimizar consultas frecuentes.
- **Vistas de compatibilidad** (`"Residentes"`, `"Cuotas"`, `"Pagos"`) para consultas con mayúsculas.
- **Datos semilla** incluidos: 1 administrador y 1 residente (Carlos Ramírez, Lote 14).

---

## 🔒 Capa de Seguridad — JSON Web Token (JWT)

### Flujo de autenticación

```
Cliente                    API Express               Supabase
  │── POST /api/auth/login ──►│                          │
  │    {correo, password}      │── SELECT Residentes ───►│
  │                            │◄── Usuario + hash ───────│
  │                            │── bcrypt.compare() ──────│ (verifica hash local)
  │                            │── jwt.sign(payload) ─────│ (firma con JWT_SECRET)
  │◄── {token, usuario} ───────│                          │
  │                            │                          │
  │── POST /api/cuotas ───────►│                          │
  │    Authorization: Bearer   │── verifyToken() ─────────│ (intercepta petición)
  │    <token_jwt>             │── jwt.verify(token) ─────│ (valida firma + expiración)
  │                            │── INSERT Cuotas ─────────►│
  │◄── HTTP 201 Created ───────│◄── Registro insertado ───│
```

### Middleware `verifyToken` — Resumen de validaciones

| Caso                            | Código HTTP | Respuesta                                      |
|---------------------------------|:-----------:|------------------------------------------------|
| Sin cabecera `Authorization`    | `401`       | "Se requiere cabecera Authorization Bearer"    |
| Token alterado / firma inválida | `403`       | "Token no válido, firma alterada o corrupto"   |
| Token vencido (`exp` excedido)  | `401`       | "Sesión expirada. Inicie sesión nuevamente"    |
| Token válido                    | `next()`    | Inyecta `req.user` y pasa al controlador       |

### Control de acceso por rol (RBAC)
El middleware `authorizeRoles('Administrador')` permite restringir rutas según el claim `rol` contenido en el payload del JWT, impidiendo que un residente ejecute operaciones administrativas.

---

## 🌐 Referencia de Endpoints de la API

Base URL: `http://localhost:3000`

### Autenticación (`/api/auth`)

| Método | Ruta                   | Acceso    | Descripción                              |
|--------|------------------------|:---------:|------------------------------------------|
| `POST` | `/api/auth/login`      | Público   | Inicia sesión y emite token JWT (8 h)   |
| `POST` | `/api/auth/register`   | Público   | Registra residente con password hasheado |

**Body de login:**
```json
{
  "correo": "admin@vallehermoso.mx",
  "password": "Admin123!"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Autenticación exitosa en el Sistema Valle Hermoso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_residente": 1,
    "nombre": "Administración Valle Hermoso",
    "correo": "admin@vallehermoso.mx",
    "rol": "Administrador"
  }
}
```

---

### Cuotas (`/api/cuotas`)

| Método   | Ruta              | Acceso                  | Descripción                                 |
|----------|-------------------|:-----------------------:|---------------------------------------------|
| `GET`    | `/api/cuotas`     | Público                 | Lista todas las cuotas (filtros opcionales) |
| `GET`    | `/api/cuotas/:id` | Público                 | Detalle de una cuota por ID                 |
| `POST`   | `/api/cuotas`     | 🔒 Requiere JWT         | Crea una nueva cuota para un residente      |
| `PUT`    | `/api/cuotas/:id` | 🔒 Requiere JWT         | Actualiza monto o estado de una cuota       |
| `DELETE` | `/api/cuotas/:id` | 🔒 Requiere JWT         | Elimina una cuota del sistema               |

**Filtros disponibles en GET /api/cuotas:**
```
GET /api/cuotas?id_residente=2
GET /api/cuotas?estado=Pendiente
GET /api/cuotas?id_residente=2&estado=Pagado
```

**Body para crear/actualizar cuota:**
```json
{
  "id_residente": 2,
  "monto": 1200.00,
  "estado": "Pendiente"
}
```

**Cabecera requerida en rutas protegidas:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 Guía de Instalación y Ejecución

### Requisitos previos
- **Node.js v20** (instalado en este proyecto)  
  > ⚠️ La librería `@supabase/supabase-js` en su versión más reciente requiere Node 22+. Para Node 20, este proyecto utiliza `@supabase/supabase-js@2.45.4`, que es 100 % compatible.
- Cuenta activa en [Supabase](https://supabase.com).

---

### Paso 1 — Configurar la base de datos en Supabase

1. Entra a tu proyecto en [supabase.com](https://supabase.com).
2. En el menú lateral, haz clic en **SQL Editor** y luego en **New query**.
3. Copia el contenido completo de [`database.sql`](./database.sql) y pégalo en el editor.
4. Haz clic en **Run** (sin texto seleccionado).
5. Verifica en **Table Editor** que aparezcan las tablas: `residentes`, `cuotas` y `pagos`.

> **Nota sobre RLS:** El script ya incluye `ENABLE ROW LEVEL SECURITY` y las políticas de acceso necesarias. Si Supabase muestra la advertencia *"Potential issues detected"*, haz clic en **"Run without RLS"** (el botón naranja); las políticas ya están declaradas en el script.

---

### Paso 2 — Configurar variables de entorno

Crea el archivo `.env` dentro de la carpeta `backend/`:

```env
PORT=3000

# Disponibles en: Supabase → Project Settings → API Keys
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=eyJhbGciOi...tu_anon_key

# Clave privada para firmar los tokens JWT (cámbiala en producción)
JWT_SECRET=una_clave_larga_y_segura_2026
JWT_EXPIRES_IN=8h
```

> ⚠️ **SUPABASE_URL** debe ser solo la URL base, **sin** `/rest/v1/` al final.  
> Ejemplo correcto: `https://abcdef.supabase.co`

---

### Paso 3 — Instalar dependencias

```bash
npm install
```

---

### Paso 4 — Iniciar el servidor

```bash
# Modo producción
npm start

# Modo desarrollo (reinicio automático al guardar)
npm run dev
```

Salida esperada en consola:
```
==============================================================
🚀 Servidor ejecutándose en el puerto: 3000
📡 URL Base: http://localhost:3000
🔒 Capa de Seguridad JWT: Habilitada en rutas POST/PUT/DELETE
==============================================================
```

---

### Paso 5 — Verificar en el navegador

Abre tu navegador y visita:
- **Estado del servicio:** [http://localhost:3000](http://localhost:3000)
- **Listado de cuotas (Supabase en vivo):** [http://localhost:3000/api/cuotas](http://localhost:3000/api/cuotas)

---

## 🧪 Suite de Pruebas Automatizadas

Este proyecto incluye el script [`test-api.js`](./test-api.js) que ejecuta **5 pruebas de integración** reales contra el servidor y Supabase:

```bash
# Con el servidor corriendo en otra terminal:
npm test
```

### Pruebas que se ejecutan automáticamente:

| # | Prueba                              | Qué valida                                          |
|---|-------------------------------------|-----------------------------------------------------|
| 1 | Estado del servidor                 | El servidor responde HTTP 200                       |
| 2 | Login y generación de JWT           | Credenciales válidas → token firmado generado       |
| 3 | Consulta de cuotas en Supabase      | Lectura real de datos desde PostgreSQL              |
| 4 | Ruta protegida SIN token            | Debe retornar HTTP 401 (capa de seguridad activa)   |
| 5 | Ruta protegida CON token JWT válido | Creación exitosa HTTP 201 + limpieza automática     |

**Resultado esperado:**
```
🎉 ¡TODAS LAS PRUEBAS PASARON AL 100%!
La infraestructura de servicios, base de datos Supabase
y capa de seguridad JWT están funcionando perfectamente.
```

---

## 📦 Dependencias del Proyecto

| Paquete                   | Versión    | Propósito                                          |
|---------------------------|:----------:|----------------------------------------------------|
| `express`                 | `^4.19.2`  | Framework HTTP para construcción de la API REST    |
| `@supabase/supabase-js`   | `2.45.4`   | Cliente oficial de Supabase / PostgreSQL           |
| `jsonwebtoken`            | `^9.0.2`   | Generación y verificación de tokens JWT (RFC 7519) |
| `bcryptjs`                | `^2.4.3`   | Hashing seguro de contraseñas (salt rounds = 10)   |
| `dotenv`                  | `^16.4.5`  | Carga de variables de entorno desde `.env`         |
| `cors`                    | `^2.8.5`   | Políticas de cross-origin para clientes web        |

---

## 🛠️ Decisiones Técnicas y Notas de Implementación

| Decisión                         | Justificación                                                                            |
|----------------------------------|------------------------------------------------------------------------------------------|
| `bcryptjs` en lugar de `bcrypt`  | `bcryptjs` es una implementación pura en JS, sin dependencias nativas de C++. Evita errores de compilación en entornos Windows. |
| `@supabase/supabase-js@2.45.4`   | La versión más reciente (2.117+) requiere Node 22+ por usar WebSockets nativos. La v2.45.4 es compatible con Node 20. |
| Tablas en minúsculas en BD       | PostgreSQL convierte identificadores a minúsculas automáticamente. Se crearon vistas (`"Residentes"`, `"Cuotas"`, `"Pagos"`) para compatibilidad. |
| `SUPABASE_URL` sin `/rest/v1/`   | El SDK de Supabase construye internamente la URL correcta. Incluir el sufijo provoca un doble prefijo y errores de conexión. |
| `persistSession: false`          | En arquitecturas backend *stateless*, no se deben persistir sesiones de usuario en memoria del servidor. |
| `require.main === module`        | Permite importar `app` desde `test-api.js` sin levantar un segundo servidor en el puerto 3000. |

---

## 👥 Usuarios de Prueba

| Nombre                       | Correo                            | Contraseña      | Rol            |
|------------------------------|-----------------------------------|-----------------|----------------|
| Administración Valle Hermoso | `admin@vallehermoso.mx`           | `Admin123!`     | Administrador  |
| Carlos Ramírez Gómez         | `carlos.ramirez@vallehermoso.mx`  | `Residente123!` | Residente      |

---

## 📄 Licencia

ISC · Pedro Pablo Rodríguez Gómez · UDG Virtual · 2026
