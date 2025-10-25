# ============================================================
# Makefile per gestione linting, formattazione e qualità codice
# Progetto: FastAPI + SQLAlchemy + Ruff
# ============================================================

# Variabili
PYTHON := python
RUFF := ruff
SRC_DIR := src
TEST_DIR := tests

# ============================================================
# Regole principali
# ============================================================

## Mostra tutti i comandi disponibili
help:
	@echo "Comandi disponibili:"
	@echo "  make lint       - Controlla lo stile del codice con Ruff"
	@echo "  make fix        - Applica correzioni automatiche (Ruff --fix)"
	@echo "  make format     - Format del codice (Ruff format)"
	@echo "  make check      - Esegue lint + format check (senza modificare)"
	@echo "  make clean      - Rimuove cache e file temporanei"
	@echo "  make all        - Esegue lint, fix e format in sequenza"

## Controlla il codice (linting)
lint:
	@echo "🔍 Eseguo Ruff check..."
	$(RUFF) check $(SRC_DIR) $(TEST_DIR)

## Corregge automaticamente dove possibile
fix:
	@echo "🛠️  Applico fix automatici Ruff..."
	$(RUFF) check $(SRC_DIR) $(TEST_DIR) --fix

## Format automatico del codice
format:
	@echo "🎨 Format del codice con Ruff..."
	$(RUFF) format $(SRC_DIR) $(TEST_DIR)

## Verifica che il codice sia già formattato correttamente (senza modifiche)
check:
	@echo "✅ Verifica formattazione..."
	$(RUFF) format --check $(SRC_DIR) $(TEST_DIR)
	@echo "✅ Verifica linting..."
	$(RUFF) check $(SRC_DIR) $(TEST_DIR)

## Pulisce la cache e file temporanei
clean:
	@echo "🧹 Pulizia..."
	rm -rf __pycache__ .ruff_cache .pytest_cache .mypy_cache

## Esegue tutti i controlli principali
all: check lint fix format
	@echo "🏁 Tutti i controlli completati!"
