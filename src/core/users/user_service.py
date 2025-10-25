from fastapi import status

from src.database.database_instance.db_instance import db_session
from src.models.request_models import UserCreationRequest, UserInfoRequest
from src.models.response_models import UserCreationResponse, UserInfoResponse
from src.entities.user_entity import User

db = db_session()

def create_user(user: UserCreationRequest) -> UserCreationResponse:
    if _equal_password(
        password=user.password, confirm_password=user.confirm_password
    ):
        try:
            new_user = User(name=user.username,email=user.email ,password=user.password)
            db.add(new_user)
            db.commit()
            return UserCreationResponse(
                return_code=status.HTTP_201_CREATED,
                message="User created successfully",
                username=user.username,
            )
        except Exception as e:
            db.rollback()
            return UserCreationResponse(
                return_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message=f"Error creating user: {str(e)}",
                username=user.username,
            )
    else:
        return UserCreationResponse(
            return_code=status.HTTP_400_BAD_REQUEST,
            message="Password do not match",
            username=user.username,
        )


def get_user(user: UserInfoRequest) -> UserInfoResponse | None:
    user = db.query(User).filter(User.name == user.username).first()
    return UserInfoResponse(
        return_code=status.HTTP_200_OK,
        username=user.username,
    )


def update_user():
    pass


def delete_user():
    pass

def _equal_password(password: str, confirm_password: str) -> bool:
    return password == confirm_password
