# Servizi Locali

Un'applicazione web per trovare professionisti e servizi pubblici nella tua zona. Connessioni dirette con idraulici, elettricisti, giardinieri e altri professionisti locali.

## 🚀 Funzionalità

### Per gli Utenti
- **Ricerca Professionisti**: Trova professionisti per categoria (idraulico, elettricista, giardiniere, etc.)
- **Filtri Avanzati**: Filtra per zona, rating, specializzazioni
- **Contatti Diretti**: Chiama direttamente i professionisti
- **Servizi Pubblici**: Informazioni su uffici, farmacie, banche
- **Navigazione**: Apri l'app di navigazione per raggiungere i servizi
- **Recensioni**: Visualizza rating e recensioni dei professionisti

### Per i Professionisti
- **Profilo Completo**: Foto, descrizione, specializzazioni
- **Servizi e Prezzi**: Lista servizi con prezzi indicativi
- **Orari Disponibili**: Informazioni su disponibilità
- **Zona di Servizio**: Area geografica di competenza

## 🛠️ Tecnologie Utilizzate

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Deployment**: Vercel (free tier)

## 📁 Struttura del Progetto

```
src/
├── app/                    # App Router di Next.js
│   ├── page.tsx           # Homepage
│   └── servizi-pubblici/  # Pagina servizi pubblici
├── components/            # Componenti React
│   ├── Header.tsx        # Header con navigazione
│   ├── SearchBar.tsx     # Barra di ricerca
│   ├── CategoryGrid.tsx  # Griglia categorie
│   └── ProfessionistaCard.tsx # Card professionista
├── store/                # State management
│   └── index.ts          # Store Zustand
├── types/                # TypeScript types
│   └── index.ts          # Interfacce principali
└── data/                 # Dati di esempio
    └── mockData.ts       # Professionisti e servizi
```

## 🚀 Come Avviare il Progetto

1. **Clona il repository**
   ```bash
   git clone <repository-url>
   cd servizi-locali
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

4. **Apri nel browser**
   ```
   http://localhost:3000
   ```

## 📱 Funzionalità Principali

### Homepage
- Ricerca professionisti con filtri
- Griglia categorie cliccabili
- Lista professionisti con rating
- Contatti diretti via telefono

### Servizi Pubblici
- Lista uffici, farmacie, banche
- Indirizzi cliccabili per navigazione
- Numeri di telefono per chiamate dirette
- Orari di apertura

## 🎨 Design System

### Colori
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Gray**: Scale da 50 a 900

### Componenti
- Card con hover effects
- Bottoni con stati interattivi
- Form con validazione
- Icone Lucide React

## 📊 Dati di Esempio

Il progetto include dati di esempio per:
- **3 Professionisti**: Idraulico, Elettricista, Giardiniere
- **5 Servizi Pubblici**: Comune, Poste, Farmacia, Banca, ASL
- **6 Categorie**: Idraulico, Elettricista, Giardiniere, Imbianchino, Meccanico, Informatico

## 🔧 Configurazione

### Variabili d'Ambiente
```env
# Database (per sviluppo futuro)
DATABASE_URL=your_database_url
```

### Script Disponibili
```bash
npm run dev          # Server di sviluppo
npm run build        # Build di produzione
npm run start        # Server di produzione
npm run lint         # Linting
```

## 🚀 Roadmap

### Fase 1 (Completata) ✅
- [x] Setup progetto Next.js
- [x] Componenti base
- [x] State management
- [x] Homepage funzionale
- [x] Pagina servizi pubblici

### Fase 2 (In Sviluppo) 🔄
- [ ] Sistema autenticazione
- [ ] Dashboard professionisti
- [ ] Sistema recensioni

### Fase 3 (Pianificata) 📋
- [ ] Database MongoDB/Firebase
- [ ] Sistema notifiche
- [ ] App mobile (React Native)
- [ ] Sistema pagamenti

## 🤝 Contribuire

1. Fork il progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## 📞 Contatti

- **Email**: info@servizilocali.it
- **Website**: https://servizilocali.it
- **GitHub**: https://github.com/servizilocali

---

**Servizi Locali** - Connessioni dirette con professionisti locali 🏠
