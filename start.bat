@echo off

:: Start the FastAPI application using Gunicorn
gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b :8000 src.main:app