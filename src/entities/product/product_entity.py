from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import JSON, Column, Integer, String, Index

from src.entities.base import Base


class Product(Base):

    __tablename__ = "Products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Integer, index=True)
    category_id = Column(Integer, index=True)
    tags = Column(JSONB, index=True)
    created_at = Column(String, index=True)
    description = Column(String, index=True)

Index('ix_Products_tags', Product.tags, postgresql_using='gin')