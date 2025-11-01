from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from src.entities.base import Base

product_category = Table(
    "ProductCategories",
    Base.metadata,
    Column("product_id", Integer, ForeignKey("Products.id")),
    Column("category_id", Integer, ForeignKey("Categories.id")),
)


class Category(Base):
    __tablename__ = "Categories"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    product_id = relationship("Product", secondary=product_category, back_populates="category_id")
