from sqlalchemy import Column, Integer, String

from src.entities.base import Base


class Category(Base):
    __tablename__ = "Categories"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
