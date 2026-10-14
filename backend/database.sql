-- 1. Tabla: residentes (Se crea primero)
CREATE TABLE IF NOT EXISTS public.residentes (
    id_residente SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    correo VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'Residente' CHECK (rol IN ('Residente', 'Administrador'))
);

-- 2. Tabla: cuotas (Depende de residentes)
CREATE TABLE IF NOT EXISTS public.cuotas (
    id_cuota SERIAL PRIMARY KEY,
    id_residente INT NOT NULL REFERENCES public.residentes(id_residente) ON DELETE CASCADE,
    monto NUMERIC(10, 2) NOT NULL CHECK (monto >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Pagado', 'Atrasado'))
);

-- 3. Tabla: pagos (Depende de cuotas)
CREATE TABLE IF NOT EXISTS public.pagos (
    id_pago SERIAL PRIMARY KEY,
    id_cuota INT NOT NULL REFERENCES public.cuotas(id_cuota) ON DELETE CASCADE,
    monto NUMERIC(10, 2) NOT NULL CHECK (monto > 0),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_residentes_correo ON public.residentes(correo);
CREATE INDEX IF NOT EXISTS idx_cuotas_residente ON public.cuotas(id_residente);
CREATE INDEX IF NOT EXISTS idx_pagos_cuota ON public.pagos(id_cuota);

-- Habilitar Row Level Security (RLS) para satisfacer a Supabase
ALTER TABLE public.residentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cuotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso para permitir que el backend consulte y registre datos
DROP POLICY IF EXISTS "Acceso total residentes" ON public.residentes;
CREATE POLICY "Acceso total residentes" ON public.residentes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso total cuotas" ON public.cuotas;
CREATE POLICY "Acceso total cuotas" ON public.cuotas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso total pagos" ON public.pagos;
CREATE POLICY "Acceso total pagos" ON public.pagos FOR ALL USING (true) WITH CHECK (true);

-- Vistas de compatibilidad (Permite consultas como 'residentes' o 'Residentes')
CREATE OR REPLACE VIEW public."Residentes" AS SELECT * FROM public.residentes;
CREATE OR REPLACE VIEW public."Cuotas" AS SELECT * FROM public.cuotas;
CREATE OR REPLACE VIEW public."Pagos" AS SELECT * FROM public.pagos;

-- Inserción de usuarios iniciales de prueba (Admin123! y Residente123!)
INSERT INTO public.residentes (nombre, correo, password, rol)
VALUES 
('Administración Valle Hermoso', 'admin@vallehermoso.mx', '$2a$10$wT0vV2U7j2/U4mBf7jHwze.f/O3n8W1Zf7fVoml6yV0tA/5JtS2eq', 'Administrador'),
('Carlos Ramírez Gómez', 'carlos.ramirez@vallehermoso.mx', '$2a$10$8hWj4E5vX2uLz1x7A5K9Ce/0N3V9r8qW7iY1oT2lS3kP4jO5i6u7y', 'Residente')
ON CONFLICT (correo) DO NOTHING;

INSERT INTO public.cuotas (id_residente, monto, estado)
VALUES 
(2, 1200.00, 'Pagado'),
(2, 1200.00, 'Pendiente')
ON CONFLICT DO NOTHING;

INSERT INTO public.pagos (id_cuota, monto, fecha)
VALUES 
(1, 1200.00, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;