#!/bin/bash

# Run Alembic migrations
echo "Running Alembic migrations..."
uv run alembic revision --autogenerate -m "update tables"
uv run alembic upgrade head

# Start the FastAPI application using Uvicorn
echo "Starting FastAPI application..."
exec uv run uvicorn src.main:app --host 0.0.0.0 --port 8000
