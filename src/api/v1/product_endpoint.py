from fastapi import APIRouter

from src.models.request_models import UserCreationRequest, UserInfoRequest
from src.models.response_models import UserCreationResponse, UserInfoResponse

router = APIRouter(
    prefix="/v1/user",
    tags=["user"]
)


