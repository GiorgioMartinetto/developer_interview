from typing import Any

from pydantic import BaseModel


class HealthResponse(BaseModel):
    message: str


class HTTPResponse(BaseModel):
    status: int
    message: str
    data: Any | None = None