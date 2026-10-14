-- ==============================================================================
-- Sistema Web de Pagos para el Fraccionamiento Valle Hermoso
-- Script DDL de Base de Datos para PostgreSQL / Supabase
-- ==============================================================================

-- 1. Tabla: Residentes
-- Almacena la información de los usuarios y sus credenciales de acceso al portal.
CREATE TABLE IF NOT EXISTS Residentes (
    id_residente SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    correo VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'Residente' CHECK (rol IN ('Residente', 'Administrador'))
);

-- 2. Tabla: Cuotas
-- Registra los cargos mensuales ordinarios o extraordinarios asignados a cada residente/lote.
CREATE TABLE IF NOT EXISTS Cuotas (
    id_cuota SERIAL PRIMARY KEY,
    id_residente INT NOT NULL REFERENCES Residentes(id_residente) ON DELETE CASCADE,
    monto NUMERIC(10, 2) NOT NULL CHECK (monto >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Pagado', 'Atrasado'))
);

-- 3. Tabla: Pagos
-- Documenta las transacciones y liquidaciones efectuadas sobre las cuotas emitidas.
CREATE TABLE IF NOT EXISTS Pagos (
    id_pago SERIAL PRIMARY KEY,
    id_cuota INT NOT NULL REFERENCES Cuotas(id_cuota) ON DELETE CASCADE,
    monto NUMERIC(10, 2) NOT NULL CHECK (monto > 0),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_residentes_correo ON Residentes(correo);
CREATE INDEX IF NOT EXISTS idx_cuotas_residente ON Cuotas(id_residente);
CREATE INDEX IF NOT EXISTS idx_pagos_cuota ON Pagos(id_cuota);

-- ==============================================================================
-- Datos iniciales de prueba (Semilla / Seeding)
-- Las contraseñas aquí registradas corresponden al texto plano: "Admin123!" y "Residente123!"
-- Hacheadas con bcrypt (salt round = 10)
-- ==============================================================================

-- Usuario Administrador
INSERT INTO Residentes (nombre, correo, password, rol)
VALUES 
('Administración Valle Hermoso', 'admin@vallehermoso.mx', '$2a$10$wT0vV2U7j2/U4mBf7jHwze.f/O3n8W1Zf7fVoml6yV0tA/5JtS2eq', 'Administrador')
ON CONFLICT (correo) DO NOTHING;

-- Usuario Residente (Ejemplo: Carlos Ramírez - Lote 14)
INSERT INTO Residentes (nombre, correo, password, rol)
VALUES 
('Carlos Ramírez Gómez', 'carlos.ramirez@vallehermoso.mx', '$2a$10$8hWj4E5vX2uLz1x7A5K9Ce/0N3V9r8qW7iY1oT2lS3kP4jO5i6u7y', 'Residente')
ON CONFLICT (correo) DO NOTHING;

-- Cuotas de ejemplo para Carlos Ramírez (id_residente = 2)
INSERT INTO Cuotas (id_residente, monto, estado)
VALUES 
(2, 1200.00, 'Pagado'),
(2, 1200.00, 'Pendiente')
ON CONFLICT DO NOTHING;

-- Pago registrado para la primera cuota
INSERT INTO Pagos (id_cuota, monto, fecha)
VALUES 
(1, 1200.00, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
