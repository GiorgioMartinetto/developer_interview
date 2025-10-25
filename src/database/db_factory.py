import sqlalchemy as sql

from src.config.db_setting import get_setting


class DatabaseFactory:
    @staticmethod
    def create_engine():
        engine = sql.create_engine(get_setting().DATABASE_URL)
        return engine
