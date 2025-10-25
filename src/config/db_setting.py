from functools import lru_cache

from pydantic import BaseModel

from src.utilis.sys_utilis import load_db_config


class DatabaseSetting(BaseModel):
    DB_TYPE: str
    DB_DRIVER: str
    DB_PASSWORD: str
    DB_USER: str
    DB_HOST: str
    DB_PORT: str
    DB_NAME: str

    @property
    def DATABASE_URL(self):
        return f"{self.DB_TYPE}+{self.DB_DRIVER}://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


@lru_cache
def get_setting() -> DatabaseSetting:
    data = load_db_config(".env.db")
    return DatabaseSetting(**data)
