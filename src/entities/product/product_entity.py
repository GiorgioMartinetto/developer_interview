from sqlalchemy import Column, Index, Integer, String
from sqlalchemy.dialects.postgresql import JSONB

from src.entities.base import Base
from sqlalchemy.orm import relationship
from src.entities.category.category_entity import Category, product_category


class Product(Base):

    __tablename__ = "Products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Integer, index=True)

    category_id = relationship("Category", secondary=product_category, back_populates="product_id")
    tags = Column(JSONB, index=True)
    created_at = Column(String, index=True)
    description = Column(String, index=True)

Index('ix_Products_tags', Product.tags, postgresql_using='gin')