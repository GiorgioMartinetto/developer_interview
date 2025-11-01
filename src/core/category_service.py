

from src.entities.category_crud import create_category, get_categories_list
from src.models.request_models import CreateCategoryRequest


def create_category_service(category: CreateCategoryRequest) -> dict:
    try:
        create_category(category)
        return {"message": "Category created successfully"}
    except Exception as e:
        raise ValueError(str(e)) from e


def get_categories_list_service() -> dict:
    try:
        categories = get_categories_list()
        return {
            "message": "Categories list retrieved successfully",
            "data": categories
        }
    except Exception as e:
        raise ValueError(str(e)) from e
