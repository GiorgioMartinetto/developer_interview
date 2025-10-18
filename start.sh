#!/bin/bash

# Start the FastAPI application using Gunicorn
exec gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b :8000 src.main:app