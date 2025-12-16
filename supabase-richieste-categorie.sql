-- ============================================
-- TABELLA RICHIESTE CATEGORIE
-- ============================================
-- Tabella per gestire le richieste di nuove categorie da parte dei professionisti
-- ============================================

CREATE TABLE IF NOT EXISTS richieste_categorie (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_categoria TEXT NOT NULL,
  descrizione TEXT,
  richiedente_email TEXT NOT NULL,
  richiedente_nome TEXT NOT NULL,
  stato TEXT NOT NULL DEFAULT 'pending' CHECK (stato IN ('pending', 'approvata', 'rifiutata')),
  data_richiesta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_risposta TIMESTAMP WITH TIME ZONE,
  admin_note TEXT,
  categoria_creata_id TEXT, -- ID della categoria creata se approvata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_richieste_categorie_stato 
ON richieste_categorie(stato) 
WHERE stato = 'pending';

CREATE INDEX IF NOT EXISTS idx_richieste_categorie_email 
ON richieste_categorie(richiedente_email);

CREATE INDEX IF NOT EXISTS idx_richieste_categorie_data 
ON richieste_categorie(data_richiesta DESC);

-- Indice composito per evitare duplicati (1 richiesta per categoria per email)
CREATE UNIQUE INDEX IF NOT EXISTS idx_richieste_categorie_unique 
ON richieste_categorie(richiedente_email, LOWER(TRIM(nome_categoria)), stato) 
WHERE stato = 'pending';

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Rimuovi il trigger se esiste già, poi ricrealo
DROP TRIGGER IF EXISTS update_richieste_categorie_updated_at ON richieste_categorie;
CREATE TRIGGER update_richieste_categorie_updated_at 
BEFORE UPDATE ON richieste_categorie 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE richieste_categorie ENABLE ROW LEVEL SECURITY;

-- Rimuovi le policies se esistono già, poi ricreale
DROP POLICY IF EXISTS "Chiunque può creare richieste categorie" ON richieste_categorie;
DROP POLICY IF EXISTS "Solo admin può vedere richieste categorie" ON richieste_categorie;
DROP POLICY IF EXISTS "Solo admin può aggiornare richieste categorie" ON richieste_categorie;
DROP POLICY IF EXISTS "Utenti possono vedere proprie richieste" ON richieste_categorie;

-- Policy: chiunque può creare una richiesta
CREATE POLICY "Chiunque può creare richieste categorie"
ON richieste_categorie
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Policy: solo admin può vedere tutte le richieste
CREATE POLICY "Solo admin può vedere richieste categorie"
ON richieste_categorie
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_app_meta_data->>'role')::text = 'admin'
  )
);

-- Policy: solo admin può aggiornare richieste
CREATE POLICY "Solo admin può aggiornare richieste categorie"
ON richieste_categorie
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_app_meta_data->>'role')::text = 'admin'
  )
);

-- Policy: utenti possono vedere solo le proprie richieste
CREATE POLICY "Utenti possono vedere proprie richieste"
ON richieste_categorie
FOR SELECT
TO authenticated
USING (
  richiedente_email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
);

-- ============================================
-- NOTE
-- ============================================
-- 1. L'indice unique previene richieste duplicate per la stessa categoria
-- 2. RLS garantisce che solo admin possa gestire le richieste
-- 3. Gli utenti possono vedere solo le proprie richieste
-- 4. Il trigger aggiorna automaticamente updated_at

