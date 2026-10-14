# Backend API - Sistema Web de Pagos Fraccionamiento Valle Hermoso

API REST modular desarrollada con **Node.js**, **Express**, **Supabase (PostgreSQL)** y autenticación mediante **JSON Web Tokens (JWT)**.

---

## 📁 Estructura del Proyecto (Patrón MVC)

```
backend/
├── config/
│   └── db.js                 # Conexión al cliente de Supabase
├── controllers/
│   ├── authController.js     # Lógica de login, hash de contraseñas y emisión de JWT
│   └── cuotasController.js   # Lógica CRUD de la entidad Cuotas
├── middlewares/
│   └── auth.js               # Middleware de verificación e interceptor de tokens JWT
├── routes/
│   ├── auth.js               # Endpoints de autenticación (/api/auth)
│   └── cuotas.js             # Endpoints para operaciones sobre cuotas (/api/cuotas)
├── database.sql              # Scripts DDL para crear las tablas en Supabase
├── .env.example              # Plantilla de variables de entorno
├── index.js                  # Punto de entrada y configuración de Express
└── package.json              # Manifiesto de dependencias
```

---

## 🚀 Guía de Instalación y Ejecución

### 1. Requisitos Previos
- Node.js versión 18 o superior.
- Una cuenta y proyecto creado en [Supabase](https://supabase.com).

### 2. Configurar la Base de Datos en Supabase
1. Ingresa a tu panel de Supabase y abre el **SQL Editor**.
2. Copia y ejecuta el contenido del archivo `database.sql`.
3. Esto creará las 3 tablas relacionales (`Residentes`, `Cuotas`, `Pagos`) e insertará registros de prueba con contraseñas encriptadas con bcrypt.

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la carpeta `backend` copiando `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:
```env
PORT=3000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_supabase_anon_o_service_role_key
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=8h
```

### 4. Instalar Dependencias
Dentro de la carpeta `backend/`:
```bash
npm install
```

### 5. Iniciar la API
Modo producción:
```bash
npm start
```

Modo desarrollo (reinicio automático con Node 18+):
```bash
npm run dev
```

---

## 🔒 Pruebas de Endpoints con cURL o Postman

### 1. Iniciar Sesión (Obtener Token)
- **POST** `http://localhost:3000/api/auth/login`
- **Body (JSON):**
```json
{
  "correo": "admin@vallehermoso.mx",
  "password": "Admin123!"
}
```
- **Respuesta:** Devuelve un token JWT con duración de 8 horas.

### 2. Consultar Cuotas (Público)
- **GET** `http://localhost:3000/api/cuotas`

### 3. Crear Nueva Cuota (Protegido por JWT)
- **POST** `http://localhost:3000/api/cuotas`
- **Headers:** `Authorization: Bearer <TU_TOKEN_JWT>`
- **Body (JSON):**
```json
{
  "id_residente": 2,
  "monto": 1200.00,
  "estado": "Pendiente"
}
```
