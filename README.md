# Sistema Web de Pagos para el Fraccionamiento Valle Hermoso

[![GitHub Pages](https://img.shields.io/badge/Demo_en_Vivo-GitHub_Pages-059669?style=for-the-badge&logo=github)](https://pablovirtual.github.io/Proyecto-valle-hermoso/)
[![Estado](https://img.shields.io/badge/Prototipo-Funcional_100%25-0284c7?style=for-the-badge)](https://pablovirtual.github.io/Proyecto-valle-hermoso/)

**Prototipo Web Funcional e Interactivo**  
*Universidad de Guadalajara — UDG Virtual*  
- **Materia:** Proyecto VI / VII  
- **Estudiante y Desarrollador:** Pedro Pablo Rodríguez Gómez  
- **Docente:** Mtra. Úrsula del Pilar González Robles  

🌐 **Acceso Directo en Línea (Demo GitHub Pages):**  
👉 **[https://pablovirtual.github.io/Proyecto-valle-hermoso/](https://pablovirtual.github.io/Proyecto-valle-hermoso/)**

---

## 📌 Contexto y Problemática

En el **Fraccionamiento Valle Hermoso**, la administración vecinal controla cuotas y pagos mediante canales dispersos y hojas de cálculo desconectadas. Esto provoca:
1. Dificultad para consultar adeudos y estados de cuenta en tiempo real.
2. Comprobantes de transferencia extraviados o de difícil identificación.
3. Riego de capturas duplicadas y retrasos en la conciliación bancaria.
4. Falta de transparencia y retraso en reportes financieros para la asamblea general.

### 💡 Propuesta de Solución
Un **Sistema Web Transaccional y Administrativo** que centraliza la administración de cuotas, el registro y consulta de pagos, la generación inmediata de comprobantes digitales, la solicitud de facturación fiscal (CFDI 4.0) y la elaboración de reportes de ingresos y egresos.

---

## 🚀 Cómo Ejecutar el Prototipo

El prototipo está diseñado para ejecutarse sin complicaciones de dependencias pesadas:

### Opción 1: Mediante Servidor Local Python (Recomendada)
Haz doble clic en el archivo:
```
start-prototype.bat
```
O ejecuta en la terminal:
```bash
python server.py
```
*Se abrirá automáticamente tu navegador en `http://localhost:8080`.*

### Opción 2: Abrir Directamente en el Navegador
Simplemente haz doble clic o abre el archivo [index.html](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/index.html) en Google Chrome o Microsoft Edge.

---

## 🛠️ Módulos y Funcionalidades del Prototipo

### 1. 🌐 Portal Público / Landing Page
- Información general del Fraccionamiento Valle Hermoso.
- Cuotas del periodo (Mantenimiento ordinario mensual de $1,200 MXN).
- Avisos comunitarios, proyectos de mejora común y normativas fiscales.
- Acceso rápido a inicio de sesión con roles diferenciados.

### 2. 👤 Portal del Residente (Lote 14 - Carlos Ramírez)
- **Estado de Cuenta en Vivo:** Visualización de cuotas pendientes, fechas de vencimiento y monto total.
- **Pasarela de Pago Simulada:**
  - **Tarjeta de Débito/Crédito:** Formulario con validación visual interactiva, enmascaramiento de datos, cumplimiento conceptual con el estándar **PCI DSS** (sin almacenamiento de CVV ni número completo en BD) y confirmación inmediata con animación y folio de transacción.
  - **Transferencia SPEI:** Instrucciones interbancarias (Banco BBVA, CLABE y Beneficiario), generación de **Referencia Única Alfanumérica** (`VH-L14-202610`), simulación de carga de comprobante y pase a la bandeja de conciliación.
- **Comprobante Digital / Recibo Oficial:**
  - Folio único institucional (ej. `VH-2026-0842`).
  - Sello digital simulado (SHA-256).
  - **Código QR dinámico** generado en tiempo real con cadena de verificación.
  - Botón de **Imprimir / Guardar en PDF** con estilos optimizados para impresión.
- **Historial de Transacciones:** Consulta de todos los pagos realizados, montos, métodos y estatus.
- **Módulo de Facturación (CFDI 4.0):** Captura y persistencia de RFC, Razón Social, Régimen Fiscal, Uso de CFDI y Código Postal.

### 3. 🛡️ Panel Administrativo (Mesa Directiva)
- **Dashboard Ejecutivo:** KPIs en tiempo real (Recaudación del mes, Cartera vencida / Morosidad, Pagos pendientes por conciliar y Egresos operativos).
- **Bandeja de Conciliación de Pagos:** Lista de transferencias SPEI reportadas por los residentes. El administrador puede verificar el comprobante y con un solo clic:
  - **Aprobar:** Actualiza la cuota a pagada, rebaja el saldo del residente y genera el recibo.
  - **Rechazar con Nota:** Permite ingresar observaciones (ej. "Monto incompleto").
- **Padrón de 25 Lotes y Residentes:** Directorio vecinal completo con estatus de cuota ("Al corriente" o "Con adeudo"), saldos, contactos y buscador en tiempo real.
- **Emisión de Cuotas Generales:** Creación de cuotas ordinarias o extraordinarias que se aplican automáticamente a los 25 lotes.
- **Libro de Egresos:** Registro de gastos operativos (seguridad caseta, CFE luminarias, jardinería, mantenimiento alberca).
- **Reportes Financieros Interactivos:** Gráficas con **Chart.js** (Flujo mensual de ingresos vs. egresos y distribución porcentual del gasto).
- **Exportación a CSV / Excel:** Generación automática de archivo descargable con el balance y movimientos.
- **Bitácora de Trazabilidad / Auditoría:** Registro cronológico de acciones sensibles realizadas por usuarios o el sistema.

---

## 💾 Persistencia de Datos
El prototipo utiliza `LocalStorage` para mantener todos los cambios entre recargas (pagos efectuados, transferencias conciliadas, nuevas cuotas o egresos).
- Incluye un botón **"Reiniciar Datos"** en la barra superior para restaurar el estado demo en cualquier momento.

---

## 📂 Archivos del Proyecto
- [index.html](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/index.html) — Interfaz principal responsiva (SPA).
- [api-service.js](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/api-service.js) — Capa de servicio e integración con la API REST (Node.js/Express) y gestión de tokens JWT.
- [app.js](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/app.js) — Lógica de negocio, conexión bidireccional con Supabase y pasarela transaccional.
- [styles.css](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/styles.css) — Estilos personalizados y vista de impresión para recibos.
- [backend/](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/backend) — Servidor API REST con Express, Supabase (PostgreSQL), JWT y CRUD de Residentes, Cuotas y Pagos.
- [server.py](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/server.py) — Servidor HTTP local con apertura automática del navegador.
- [start-prototype.bat](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/start-prototype.bat) — Lanzador ejecutable para Windows.
- [404.html](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/404.html) — Página de redirección para rutas no encontradas en GitHub Pages.
- [.nojekyll](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/.nojekyll) — Indicador para servir archivos estáticos directamente sin procesamiento Jekyll.
- [.github/workflows/deploy.yml](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/.github/workflows/deploy.yml) — Flujo de trabajo de GitHub Actions para despliegue automatizado.

---

## 🌐 Despliegue en GitHub Pages

Este proyecto está configurado para publicarse de forma gratuita e inmediata en **GitHub Pages**:

### Opción A: Despliegue Automático mediante GitHub Actions (Recomendado)
El proyecto incluye el flujo de trabajo en `.github/workflows/deploy.yml`:
1. Ve a tu repositorio en GitHub: [https://github.com/pablovirtual/Proyecto-valle-hermoso](https://github.com/pablovirtual/Proyecto-valle-hermoso)
2. Haz clic en **Settings** (Configuración) > **Pages** (en el menú lateral izquierdo).
3. En la sección **Build and deployment**:
   - En **Source**, selecciona **GitHub Actions**.
4. ¡Listo! Cada vez que hagas `git push` a la rama `main`, la web se actualizará automáticamente.

### Opción B: Despliegue Clásico desde la Rama `main`
Si prefieres el método clásico de GitHub Pages:
1. En **Settings** > **Pages** > **Build and deployment**:
   - En **Source**, selecciona **Deploy from a branch**.
   - En **Branch**, selecciona `main` y en la carpeta elige `/ (root)`.
2. Haz clic en **Save**. En un par de minutos tu sitio estará en línea en:
   👉 **https://pablovirtual.github.io/Proyecto-valle-hermoso/**
