from itertools import product

from sqlalchemy import Table, Column, DateTime, Integer, String, ForeignKey
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import relationship

from src.entities.base import Base


product_tags = Table(
    "product_tags",
    Base.metadata,
    Column("product_id", Integer, ForeignKey("Products.id")),
    Column("tag_id", Integer, ForeignKey("Tags.id")),
)


class Tags(Base):
    __tablename__ = "Tags"
    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String, index=True)
    products = relationship("Product", secondary=product_tags, back_populates="tags")



class Product(Base):
    """
    Represents a product entity

    Attributes:
        id (int): unique identifier for the product
        name (str): name of the product
        price (int): price of the product
        category_id (int): id of the category the product belongs to
        tags (str): comma-separated list of tags associated with the product
        created_at (datetime): timestamp when the product was created
        description (str): description of the product
    """
    __tablename__ = "Products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Integer, index=True)
    category_id = Column(Integer, index=True)
    tags = relationship(Tags,secondary=product_tags, back_populates="products")
    created_at = Column(String, index=True)
    description = Column(String, index=True)
