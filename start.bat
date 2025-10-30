@echo off

alembic revision --autogenerate -m "update tables"
alembic upgrade head

:: Start the FastAPI application using Gunicorn
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload