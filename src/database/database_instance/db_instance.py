from sqlalchemy.orm import scoped_session, sessionmaker

from src.database.db_factory import DatabaseFactory


class DatabaseSession:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            engine = DatabaseFactory.create_engine()
            session_factory = sessionmaker(bind=engine, autocommit=False, autoflush=False)
            cls._instance = scoped_session(session_factory)
        return cls._instance


db_session = DatabaseSession()