from datetime import datetime

from loguru import logger

from src.database.database_instance.db_instance import db_session
from src.entities.product.product_entity import Product
from src.models.request_models import CreateProductRequest


def create_product(product: CreateProductRequest):
    try:
        product_instance = Product(
            name = product.name,
            price = product.price,
            category_id = product.category_id,
            tags = product.tags,
            created_at = datetime.now().strftime("%d/%m/%Y"),
            description = product.description,
        )
        db_session.add(product_instance)
        db_session.commit()
        db_session.refresh(product_instance)
        logger.success("Product created successfully")

    except Exception as e:
        db_session.rollback()
        logger.exception(f"Error creating product: {e}")
        raise RuntimeError("Failed to create product") from e


def update_product(product: dict):
    try:
        product_instance = db_session.query(Product).filter(Product.id == product.get("id")).first()
        logger.info(product_instance)
        logger.info(product)
        if not product_instance:
            raise ValueError("Product not found")

        for key, value in product.items():
            if key.lower() == "id":
                continue

            if value is not None and hasattr(product_instance, key):
                setattr(product_instance, key, value)

        db_session.commit()
        db_session.refresh(product_instance)
        logger.success("Product updated successfully")

    except Exception as e:
        db_session.rollback()
        logger.exception(f"Error updating product: {e}")
        raise RuntimeError("Failed to update product") from e

