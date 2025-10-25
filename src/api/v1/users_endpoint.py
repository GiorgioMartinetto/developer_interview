from fastapi import APIRouter

from src.core.users.user_service import create_user,get_user
from src.models.request_models import UserCreationRequest, UserInfoRequest
from src.models.response_models import UserCreationResponse, UserInfoResponse

router = APIRouter(
    prefix="/v1/user",
    tags=["user"]
)

@router.post("/user_creation", response_model=UserCreationResponse)
def user_creation(user: UserCreationRequest) -> UserCreationResponse:
    return create_user(user)


@router.get("/user_info", response_model=UserInfoResponse)
def user_info(user: UserInfoRequest) -> UserInfoResponse:
    return get_user(user)