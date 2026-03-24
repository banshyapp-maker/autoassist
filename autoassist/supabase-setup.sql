-- ============================================================================
-- AUTOASSIST - SCRIPT DE BASE DE DATOS
-- ============================================================================
-- Este archivo contiene la estructura completa de la base de datos
-- Ya lo ejecutaste en Supabase, pero lo incluimos aquí como referencia

-- Crear ENUMs
CREATE TYPE subscription_plan AS ENUM ('starter', 'professional', 'enterprise');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected');

-- ============================================================================
-- TABLA: workshops (Talleres)
-- ============================================================================
CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  subscription_plan subscription_plan DEFAULT 'starter',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLA: customers (Clientes del Taller)
-- ============================================================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLA: vehicles (Vehículos)
-- ============================================================================
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  license_plate TEXT NOT NULL,
  vin TEXT,
  color TEXT,
  current_mileage INTEGER,
  next_maintenance_km INTEGER,
  next_maintenance_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLA: services (Servicios/Historial)
-- ============================================================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  mileage INTEGER,
  parts_used TEXT[],
  technician_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLA: quotes (Cotizaciones)
-- ============================================================================
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  pdf_url TEXT,
  status quote_status DEFAULT 'draft',
  valid_until DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLA: reminders (Recordatorios)
-- ============================================================================
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  sent_via TEXT,
  status TEXT
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================
CREATE INDEX idx_customers_workshop ON customers(workshop_id);
CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);
CREATE INDEX idx_services_vehicle ON services(vehicle_id);
CREATE INDEX idx_quotes_vehicle ON quotes(vehicle_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Políticas para workshops
CREATE POLICY "Users can view own workshop" ON workshops FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own workshop" ON workshops FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own workshop" ON workshops FOR UPDATE USING (auth.uid() = owner_id);

-- Políticas para customers
CREATE POLICY "Users can view own customers" ON customers FOR SELECT 
  USING (workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid()));
CREATE POLICY "Users can insert own customers" ON customers FOR INSERT 
  WITH CHECK (workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid()));
CREATE POLICY "Users can update own customers" ON customers FOR UPDATE 
  USING (workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid()));
CREATE POLICY "Users can delete own customers" ON customers FOR DELETE 
  USING (workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid()));

-- Políticas para vehicles
CREATE POLICY "Users can view own vehicles" ON vehicles FOR SELECT 
  USING (customer_id IN (SELECT id FROM customers WHERE workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid())));
CREATE POLICY "Users can insert own vehicles" ON vehicles FOR INSERT 
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid())));
CREATE POLICY "Users can update own vehicles" ON vehicles FOR UPDATE 
  USING (customer_id IN (SELECT id FROM customers WHERE workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid())));
CREATE POLICY "Users can delete own vehicles" ON vehicles FOR DELETE 
  USING (customer_id IN (SELECT id FROM customers WHERE workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid())));

-- Políticas para services
CREATE POLICY "Users can view own services" ON services FOR SELECT 
  USING (vehicle_id IN (SELECT id FROM vehicles WHERE customer_id IN (SELECT id FROM customers WHERE workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid()))));
CREATE POLICY "Users can insert own services" ON services FOR INSERT 
  WITH CHECK (vehicle_id IN (SELECT id FROM vehicles WHERE customer_id IN (SELECT id FROM customers WHERE workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid()))));

-- Políticas para quotes
CREATE POLICY "Users can view own quotes" ON quotes FOR SELECT 
  USING (vehicle_id IN (SELECT id FROM vehicles WHERE customer_id IN (SELECT id FROM customers WHERE workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid()))));
CREATE POLICY "Users can insert own quotes" ON quotes FOR INSERT 
  WITH CHECK (vehicle_id IN (SELECT id FROM vehicles WHERE customer_id IN (SELECT id FROM customers WHERE workshop_id IN (SELECT id FROM workshops WHERE owner_id = auth.uid()))));

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
