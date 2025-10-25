from datetime import datetime

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    started_at: datetime
    uptime_seconds: float


class UserCreationResponse(BaseModel):
    return_code: int
    message: str
    username: str


class UserInfoResponse(BaseModel):
    return_code: int
    username: str