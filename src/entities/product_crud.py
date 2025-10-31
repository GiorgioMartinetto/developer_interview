from datetime import datetime

from loguru import logger

from src.database.database_instance.db_instance import db_session
from src.entities.product_entity import Product, Tags
from src.models.request_models import CreateProductRequest


def get_all_tags():
    try:
        tags = db_session.query(Tags).all()
        return tags
    except Exception as e:
        logger.exception(f"Error getting all tags: {e}")
        raise RuntimeError("Failed to get all tags") from e

def update_tags(tags: list[str]):
    try:
        tags_list = get_all_tags()
        logger.info(f"Tags list: {tags_list}")
        existing_tags_name = [tag.tag for tag in tags_list]
        for tag in tags:
            if tag not in existing_tags_name:
                new_tag = Tags(tag=tag)
                db_session.add(new_tag)
        db_session.commit()
        logger.success("Tags updated successfully")
    except Exception as e:
        db_session.rollback()
        logger.exception(f"Error updating tags: {e}")
        raise RuntimeError("Failed to update tags") from e

def create_product(product: CreateProductRequest):
    try:
        update_tags(product.tags)

        product_instance = Product(
            name = product.name,
            price = product.price,
            category_id = product.category_id,
            tags = db_session.query(Tags).filter(Tags.tag.in_(product.tags)).all(),
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

