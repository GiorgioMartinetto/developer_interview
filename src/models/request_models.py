from pydantic import BaseModel


class UserCreationRequest(BaseModel):
    request_id: str
    username: str
    email: str
    password: str
    confirm_password: str


class UserInfoRequest(BaseModel):
    request_id: str
    username: str