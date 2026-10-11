# Sistema Web de Pagos para el Fraccionamiento Valle Hermoso

**Prototipo Web Funcional e Interactivo**  
*Universidad de Guadalajara — UDG Virtual*  
- **Materia:** Proyecto VI / VII  
- **Estudiante y Desarrollador:** Pedro Pablo Rodríguez Gómez  
- **Docente:** Mtra. Úrsula del Pilar González Robles  

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
- [app.js](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/app.js) — Lógica de negocio, base de datos simulada y pasarela transaccional.
- [styles.css](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/styles.css) — Estilos personalizados y vista de impresión para recibos.
- [server.py](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/server.py) — Servidor HTTP local con apertura automática del navegador.
- [start-prototype.bat](file:///c:/Users/ferra/OneDrive/Escritorio/Proyecto%20valle%20hermoso/start-prototype.bat) — Lanzador ejecutable para Windows.
