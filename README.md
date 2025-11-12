# Product Management System

Un sistema di gestione prodotti con frontend React/TypeScript, backend FastAPI Python e database PostgreSQL.

## Architettura

- **Frontend**: React + TypeScript + Material-UI + Vite
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Database**: PostgreSQL
- **Chatbot**: LangChain per risposte in italiano e inglese

## Funzionalità

- CRUD prodotti e categorie
- Lista prodotti filtrati per categoria
- Chatbot per domande sui prodotti/categorie
- Supporto multilingua (italiano/inglese)

## Avvio con Docker

### Prerequisiti

- Docker
- Docker Compose

### Comandi per l'avvio

1. **Clona il repository** (se necessario)
   ```bash
   git clone <repository-url>
   cd developer_interview
   ```

2. **Avvia tutti i servizi**
   ```bash
   docker-compose up --build
   ```

3. **Avvia in background** (opzionale)
   ```bash
   docker-compose up -d --build
   ```

### Accesso alle applicazioni

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Documentazione API**: http://localhost:8000/docs
- **Database PostgreSQL**: localhost:5432

### Comandi utili

```bash
# Ferma i servizi
docker-compose down

# Ricostruisci e riavvia
docker-compose up --build --force-recreate

# Visualizza i log
docker-compose logs -f

# Visualizza log di un servizio specifico
docker-compose logs -f backend

# Accedi al database
docker-compose exec postgres psql -U postgres -d postgres

# Esegui migrazioni database (se necessario)
docker-compose exec backend uv run alembic upgrade head
```

## Sviluppo Locale (senza Docker)

### Backend

```bash
# Installa dipendenze
pip install uv
uv sync

# Avvia il backend
uv run uvicorn src.main:app --reload
```

### Frontend

```bash
cd front-end

# Installa dipendenze
npm install

# Avvia il frontend
npm run dev
```

### Database

Assicurati di avere PostgreSQL installato localmente o usa Docker per il database:

```bash
docker run --name postgres-dev -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:15-alpine
```

## Struttura del Progetto

```
.
├── src/                    # Backend Python
├── front-end/             # Frontend React
├── alembic/               # Migrazioni database
├── Dockerfile.backend     # Docker per backend
├── Dockerfile.frontend    # Docker per frontend
├── docker-compose.yml     # Orchestrazione servizi
├── .dockerignore         # File da escludere dal build
└── README.md             # Questa documentazione
```

## Variabili d'Ambiente

Il sistema utilizza le seguenti variabili d'ambiente per la configurazione del database (definite in `.env.db`):

- `DB_HOST`: Host del database
- `DB_PORT`: Porta del database
- `DB_USER`: Utente database
- `DB_PASSWORD`: Password database
- `DB_NAME`: Nome database
- `DB_TYPE`: Tipo database (postgresql)
- `DB_DRIVER`: Driver database (psycopg2)

## Note

- Il database PostgreSQL mantiene i dati grazie al volume `postgres_data`
- Il backend è configurato per il reload automatico durante lo sviluppo
- Il frontend viene servito tramite `vite preview` in produzione
- Tutti i servizi sono configurati per comunicare tra loro nella rete Docker
