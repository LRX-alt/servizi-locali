-- ============================================
-- SCHEMA CALENDARIO DISPONIBILITÀ PROFESSIONISTI
-- ============================================
-- Eseguire questo script nel SQL Editor di Supabase
-- ============================================

-- Tabella per orari ricorrenti settimanali
CREATE TABLE IF NOT EXISTS disponibilita_settimanale (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professionista_id UUID NOT NULL REFERENCES professionisti(id) ON DELETE CASCADE,
  giorno_settimana INTEGER NOT NULL CHECK (giorno_settimana >= 0 AND giorno_settimana <= 6), -- 0=Lunedì, 6=Domenica
  ora_inizio TIME NOT NULL,
  ora_fine TIME NOT NULL,
  attivo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(professionista_id, giorno_settimana)
);

-- Tabella per eccezioni (giorni specifici con orari diversi o non disponibili)
CREATE TABLE IF NOT EXISTS disponibilita_eccezioni (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professionista_id UUID NOT NULL REFERENCES professionisti(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('disponibile', 'non_disponibile', 'orari_custom')),
  ora_inizio TIME,
  ora_fine TIME,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(professionista_id, data)
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_disponibilita_settimanale_prof 
  ON disponibilita_settimanale(professionista_id);

CREATE INDEX IF NOT EXISTS idx_disponibilita_eccezioni_prof 
  ON disponibilita_eccezioni(professionista_id);

CREATE INDEX IF NOT EXISTS idx_disponibilita_eccezioni_data 
  ON disponibilita_eccezioni(data);

-- Funzione per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_disponibilita_settimanale_updated_at
  BEFORE UPDATE ON disponibilita_settimanale
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disponibilita_eccezioni_updated_at
  BEFORE UPDATE ON disponibilita_eccezioni
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Solo il professionista può vedere/modificare i propri dati
ALTER TABLE disponibilita_settimanale ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilita_eccezioni ENABLE ROW LEVEL SECURITY;

-- Policy per disponibilita_settimanale
CREATE POLICY "Professionisti possono vedere solo le proprie disponibilità settimanali"
  ON disponibilita_settimanale
  FOR SELECT
  USING (auth.uid() = professionista_id);

CREATE POLICY "Professionisti possono inserire solo le proprie disponibilità settimanali"
  ON disponibilita_settimanale
  FOR INSERT
  WITH CHECK (auth.uid() = professionista_id);

CREATE POLICY "Professionisti possono aggiornare solo le proprie disponibilità settimanali"
  ON disponibilita_settimanale
  FOR UPDATE
  USING (auth.uid() = professionista_id);

CREATE POLICY "Professionisti possono eliminare solo le proprie disponibilità settimanali"
  ON disponibilita_settimanale
  FOR DELETE
  USING (auth.uid() = professionista_id);

-- Policy per disponibilita_eccezioni
CREATE POLICY "Professionisti possono vedere solo le proprie eccezioni"
  ON disponibilita_eccezioni
  FOR SELECT
  USING (auth.uid() = professionista_id);

CREATE POLICY "Professionisti possono inserire solo le proprie eccezioni"
  ON disponibilita_eccezioni
  FOR INSERT
  WITH CHECK (auth.uid() = professionista_id);

CREATE POLICY "Professionisti possono aggiornare solo le proprie eccezioni"
  ON disponibilita_eccezioni
  FOR UPDATE
  USING (auth.uid() = professionista_id);

CREATE POLICY "Professionisti possono eliminare solo le proprie eccezioni"
  ON disponibilita_eccezioni
  FOR DELETE
  USING (auth.uid() = professionista_id);

-- Policy per admin (possono vedere tutto)
CREATE POLICY "Admin possono vedere tutte le disponibilità settimanali"
  ON disponibilita_settimanale
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM professionisti
      WHERE professionisti.id = disponibilita_settimanale.professionista_id
      AND (auth.jwt() ->> 'role')::text = 'admin'
    )
  );

CREATE POLICY "Admin possono vedere tutte le eccezioni"
  ON disponibilita_eccezioni
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM professionisti
      WHERE professionisti.id = disponibilita_eccezioni.professionista_id
      AND (auth.jwt() ->> 'role')::text = 'admin'
    )
  );

