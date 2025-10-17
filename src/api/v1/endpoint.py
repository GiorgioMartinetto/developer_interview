# src/api/v1/endpoint.py
from datetime import datetime
from fastapi import APIRouter

from src.api.v1.models.response_models import HealthResponse

STARTED_AT = datetime.utcnow()


router = APIRouter(prefix="/api/v1", tags=["health"])

@router.get("/health", response_model=HealthResponse)
def health_check():
    """Health check semplice: restituisce 'ok', timestamp di avvio e uptime."""
    now = datetime.utcnow()
    uptime = (now - STARTED_AT).total_seconds()
    return HealthResponse(status="ok", started_at=STARTED_AT, uptime_seconds=round(uptime, 3))