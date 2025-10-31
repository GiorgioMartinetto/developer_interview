from loguru import logger

from src.database.database_instance.db_instance import db_session
from src.entities.category_entity import Category
from src.models.request_models import CreateCategoryRequest


def create_category(category: CreateCategoryRequest):
    try:
        category_instance = Category(
            name = category.name
        )
        db_session.add(category_instance)
        db_session.commit()
        db_session.refresh(category_instance)
        logger.success("Category created successfully")
    except Exception as e:
        db_session.rollback()
        logger.exception(f"Error creating category: {e}")
        raise RuntimeError("Failed to create category") from e

def get_categories_list() -> list[str]:
    try:
        categories = db_session.query(Category).all()
        return [category.name for category in categories]
    except Exception as e:
        logger.exception(f"Error getting categories list: {e}")
        raise RuntimeError("Failed to get categories list") from e