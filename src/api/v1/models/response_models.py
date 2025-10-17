from pydantic import BaseModel
from datetime import datetime

class HealthResponse(BaseModel):
    status: str
    started_at: datetime
    uptime_seconds: float
