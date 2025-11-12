# Product Management System

Un sistema di gestione prodotti con frontend React/TypeScript, backend FastAPI Python e database PostgreSQL.

## Architettura

- **Frontend**: React + TypeScript + Material-UI + Vite
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Database**: PostgreSQL
- **Chatbot**: LangChain e LangGraphper risposte in italiano e inglese

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
├── src/                                    # Backend Python (FastAPI)
│   ├── __init__.py
│   ├── main.py                             # Punto di ingresso dell'applicazione FastAPI
│   ├── api/                                # API endpoints
│   │   ├── __init__.py
│   │   └── v1/                             # Versione 1 delle API
│   │       ├── __init__.py
│   │       ├── cetegory_endpoints.py       # Endpoints per categorie (nota: typo in "cetegory")
│   │       ├── chatbot_endpoints.py        # Endpoints per il chatbot
│   │       └── product_endpoint.py         # Endpoints per prodotti
│   ├── config/                             # Configurazioni
│   │   ├── db_setting.py                   # Configurazione database
│   │   └── llm_setting.py                  # Configurazione LLM
│   ├── core/                               # Logica di business (servizi)
│   │   ├── __init__.py
│   │   ├── category_service.py             # Servizio per gestione categorie
│   │   ├── chatbot_service.py              # Servizio per chatbot
│   │   └── product_service.py              # Servizio per gestione prodotti
│   ├── database/                           # Gestione database
│   │   ├── __init__.py
│   │   ├── db_factory.py                   # Factory per creazione connessione DB
│   │   └── database_instance/              # Istanza database
│   │       ├── __init__.py
│   │       └── db_instance.py              # Singleton per connessione DB
│   ├── entities/                           # Entità del dominio e CRUD
│   │   ├── __init__.py
│   │   ├── base.py                         # Classe base per entità
│   │   ├── category/                       # Entità Categoria
│   │   │   ├── __init__.py
│   │   │   ├── category_crud.py            # Operazioni CRUD per categorie
│   │   │   └── category_entity.py          # Modello entità categoria
│   │   └── product/                        # Entità Prodotto
│   │       ├── __init__.py
│   │       ├── product_crud.py             # Operazioni CRUD per prodotti
│   │       └── product_entity.py           # Modello entità prodotto
│   ├── llm/                                # Integrazione LLM per chatbot
│   │   ├── chatbot.py                      # Implementazione chatbot
│   │   └── llm_factory.py                  # Factory per LLM
│   ├── log/                                # Sistema di logging
│   │   ├── __init__.py
│   │   ├── logger.py                       # Configurazione logger
│   │   └── logger_decorator.py             # Decoratore per logging
│   ├── models/                             # Modelli Pydantic per request/response
│   │   ├── __init__.py
│   │   ├── chat_model.py                   # Modelli per chat
│   │   ├── request_models.py               # Modelli request
│   │   └── response_models.py              # Modelli response
│   └── utilis/                             # Utilità di sistema
│       ├── __init__.py
│       └── sys_utilis.py                   # Utilità di sistema
├── front-end/                              # Frontend React/TypeScript
│   ├── ...
│   └── src/
│       ├── App.css
│       ├── App.tsx
│       ├── index.css
│       ├── main.tsx
│       ├── assets/                         # Immagini e risorse statiche
│       │   ├── intelligenza_artificiale_italia.png
│       │   ├── logo.png
│       │   └── prodotti.jpg
│       ├── axios/                          # Configurazione HTTP client
│       │   └── axios.ts
│       ├── components/                     # Componenti React
│       │   ├── AddProductCard.tsx
│       │   ├── MapCard.tsx
│       │   ├── MyCard.tsx
│       │   ├── MyChatBot.tsx
│       │   └── MyNavbar.tsx
│       ├── pages/                          # Pagine dell'applicazione
│       │   ├── Contacts.tsx
│       │   ├── Home.tsx
│       │   └── Products.tsx
│       ├── routes/                         # Configurazione routing
│       └── utils/                          # Utilità frontend
├── alembic/                                # Migrazioni database
│   ├── env.py
│   ├── README
│   ├── script.py.mako
│   └── versions/
├── config/                                 # Configurazioni globali
│   ├── chatbot_config.yml                  # Configurazione chatbot
│   └── llm_config.yml                      # Configurazione LLM
├── tests/                                  # Test suite
│   └── .keepme
├── .dockerignore                           # File da escludere dal build Docker
├── .gitignore                              # File da ignorare in Git
├── .python-version                         # Versione Python (pyenv)
├── alembic.ini                             # Configurazione Alembic
├── docker-compose.yml                      # Orchestrazione servizi Docker
├── Dockerfile.backend                      # Docker per backend
├── Dockerfile.frontend                     # Docker per frontend
├── Makefile                                # Comandi di build e deploy
├── pyproject.toml                          # Configurazione progetto Python
├── README.md                               # Documentazione progetto
├── requirements.txt                        # Dipendenze Python (legacy)
├── start.bat                               # Script avvio Windows
├── start.sh                                # Script avvio Unix
└── uv.lock    
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

E' presente una variabile d'ambiente per impostare la chiave API del modello LLM (definite nel file `.env`):
- `{PROVIDER}_API_KEY`: Inserisci la tua chiave

dove PROVIDER può essere uno dei seguenti valori: 
- `ANTHROPIC`
- `OPENAI`
- `AZURE`
- `GROQ`
- `AWS`

E' presente una variabile d'ambiente per impostare la chiave API della chiave di Google MAPS (definite nel file `./front-end/.env.fe`):
- `VITE_GOOGLE_MAPS_API_KEY`: Api di Google
## Note

- Il database PostgreSQL mantiene i dati grazie al volume `postgres_data`
- Il backend è configurato per il reload automatico durante lo sviluppo
- Il frontend viene servito tramite `vite preview` in produzione
- Tutti i servizi sono configurati per comunicare tra loro nella rete Docker
