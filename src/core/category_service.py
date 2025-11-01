
from src.entities.category.category_crud import create_category, get_categories_list, delete_category
from src.models.request_models import CreateCategoryRequest, DeleteCategoryRequest


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


def delete_category_service(category: DeleteCategoryRequest):
    try:
        delete_category(category)
        return {"message": "Category deleted successfully"}
    except Exception as e:
        raise ValueError(str(e)) from e