-- ============================================
-- CATEGORIE: "IN EVIDENZA" IN HOME
-- ============================================
-- Aggiunge supporto per mostrare solo alcune categorie in home (featured),
-- mantenendo nel DB una lista completa di categorie per registrazione/filtri.
--
-- Eseguire questo script nel SQL Editor di Supabase.
-- È idempotente: può essere eseguito più volte.
-- ============================================

-- 1) Colonne nuove
ALTER TABLE IF EXISTS public.categorie
  ADD COLUMN IF NOT EXISTS show_in_home boolean NOT NULL DEFAULT false;

ALTER TABLE IF EXISTS public.categorie
  ADD COLUMN IF NOT EXISTS home_order integer;

-- 2) Indici (opzionali ma utili)
CREATE INDEX IF NOT EXISTS idx_categorie_show_in_home
ON public.categorie(show_in_home)
WHERE show_in_home = true;

CREATE INDEX IF NOT EXISTS idx_categorie_home_order
ON public.categorie(home_order)
WHERE home_order IS NOT NULL;

-- 3) Seed "in evidenza" (allinea la home alle categorie attuali in mockData)
-- Nota: queste UPDATE non creano righe, aggiornano solo se esistono già.
UPDATE public.categorie SET show_in_home = true, home_order = 1 WHERE id = 'idraulico';
UPDATE public.categorie SET show_in_home = true, home_order = 2 WHERE id = 'elettricista';
UPDATE public.categorie SET show_in_home = true, home_order = 3 WHERE id = 'giardiniere';
UPDATE public.categorie SET show_in_home = true, home_order = 4 WHERE id = 'imbianchino';
UPDATE public.categorie SET show_in_home = true, home_order = 5 WHERE id = 'meccanico';
UPDATE public.categorie SET show_in_home = true, home_order = 6 WHERE id = 'informatica';
UPDATE public.categorie SET show_in_home = true, home_order = 6 WHERE id = 'informatico';




