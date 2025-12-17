# 📋 Configurazione Sistema Richieste Categorie

## 🚀 Setup Iniziale

### 1. Database - Creare Tabella

Eseguire lo script SQL in Supabase SQL Editor:
```bash
supabase-richieste-categorie.sql
```

Questo creerà:
- Tabella `richieste_categorie`
- Indici per performance
- RLS (Row Level Security) policies
- Trigger per `updated_at`

### 2. Configurazione Email (Resend)

#### Opzione A: Resend (Consigliato - Gratuito fino a 3000 email/mese)

1. **Registrati su [Resend](https://resend.com)**
2. **Crea API Key**:
   - Vai a API Keys
   - Crea nuova key
   - Copia la key

3. **Configura variabili d'ambiente**:
```bash
# .env.local o variabili Vercel
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=Servizi Locali <noreply@servizilocali.it>
```

**Nota**: Per usare un dominio personalizzato, configura DNS in Resend (vedi documentazione Resend).

#### Opzione B: Altri Servizi Email

Puoi sostituire Resend con:
- **SendGrid** (gratuito fino a 100 email/giorno)
- **Mailgun** (gratuito fino a 5000 email/mese)
- **AWS SES** (molto economico)
- **Supabase Edge Functions** (se configurato)

Modifica le funzioni `sendApprovalEmail` e `sendRejectionEmail` in:
- `src/app/api/richieste-categorie/approve/route.ts`
- `src/app/api/richieste-categorie/reject/route.ts`

### 3. Verifica Configurazione

Dopo il setup, testa:
1. Registrazione professionista → Richiedi nuova categoria
2. Admin → Dashboard → Vedi contatore richieste
3. Admin → Richieste Categorie → Approva/Rifiuta
4. Verifica email ricevuta

---

## 📧 Template Email

Le email vengono inviate automaticamente quando:
- ✅ **Richiesta approvata**: Email al professionista con link registrazione
- ❌ **Richiesta rifiutata**: Email al professionista con motivo (se fornito)

### Personalizzare Template

Modifica le funzioni in:
- `src/app/api/richieste-categorie/approve/route.ts` (linea ~100)
- `src/app/api/richieste-categorie/reject/route.ts` (linea ~80)

---

## 🔒 Sicurezza

### RLS Policies

Le policy garantiscono:
- ✅ Chiunque può creare richieste (anon/authenticated)
- ✅ Solo admin può vedere tutte le richieste
- ✅ Solo admin può approvare/rifiutare
- ✅ Utenti possono vedere solo le proprie richieste

### Validazioni

- ✅ Nome categoria: 3-50 caratteri
- ✅ 1 richiesta per categoria per email (pending)
- ✅ Verifica categoria non esistente
- ✅ Rate limiting (gestito da database unique index)

---

## 🎯 Funzionalità

### Per Professionisti

1. **Registrazione**:
   - Carica categorie dal database
   - Pulsante "Richiedi nuova categoria"
   - Modal con form richiesta
   - Validazione in tempo reale

2. **Notifiche**:
   - Email quando richiesta approvata
   - Email quando richiesta rifiutata

### Per Admin

1. **Dashboard**:
   - Contatore richieste pending
   - Badge rosso se > 0
   - Link diretto a gestione richieste

2. **Gestione Richieste**:
   - Lista tutte le richieste
   - Filtri: Tutte, Pending, Approvate, Rifiutate
   - Approva: Crea categoria + invia email
   - Rifiuta: Salva motivo + invia email

---

## 📊 Database Schema

```sql
richieste_categorie
├── id (UUID, PK)
├── nome_categoria (TEXT)
├── descrizione (TEXT, nullable)
├── richiedente_email (TEXT)
├── richiedente_nome (TEXT)
├── stato ('pending' | 'approvata' | 'rifiutata')
├── data_richiesta (TIMESTAMP)
├── data_risposta (TIMESTAMP, nullable)
├── admin_note (TEXT, nullable)
├── categoria_creata_id (TEXT, nullable)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🐛 Troubleshooting

### Email non vengono inviate

1. **Verifica RESEND_API_KEY**:
   ```bash
   echo $RESEND_API_KEY
   ```

2. **Verifica EMAIL_FROM**:
   - Deve essere formato: `Nome <email@dominio.com>`
   - Dominio deve essere verificato in Resend

3. **Controlla logs**:
   - Vercel Logs per errori API
   - Resend Dashboard per email inviate

### Richieste non appaiono in admin

1. **Verifica RLS policies**:
   - Admin deve avere `role: 'admin'` in `app_metadata`
   - Verifica token JWT

2. **Verifica autenticazione**:
   - Token deve essere valido
   - Session deve essere attiva

### Errore "Hai già una richiesta pending"

- L'indice unique previene duplicati
- Utente può richiedere solo 1 categoria alla volta (pending)
- Dopo approvazione/rifiuto, può richiedere di nuovo

---

## 📝 Note

- **Limite richieste**: 1 per categoria per email (pending)
- **Email**: Configurate con Resend (gratuito fino a 3000/mese)
- **Notifiche**: Solo email, no push notifications
- **Categorie**: Vengono create con ord=999 (admin può riordinare)

---

## ✅ Checklist Post-Implementazione

- [ ] Script SQL eseguito in Supabase
- [ ] RESEND_API_KEY configurata
- [ ] EMAIL_FROM configurato
- [ ] Test richiesta categoria da professionista
- [ ] Test approvazione da admin
- [ ] Test rifiuto da admin
- [ ] Verifica email ricevute
- [ ] Verifica contatore dashboard admin

---

*Documento creato per la configurazione del sistema richieste categorie*


