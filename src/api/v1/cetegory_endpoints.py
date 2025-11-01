from fastapi import APIRouter, status

from src.core.category_service import (
    create_category_service,
    get_categories_list_service,
    delete_category_service,
)
from src.models.request_models import CreateCategoryRequest, DeleteCategoryRequest
from src.models.response_models import HTTPResponse

category_router = APIRouter(
    prefix="/v1/category",
    tags=["category"]
)


@category_router.post("/create_category/",
                      status_code=status.HTTP_201_CREATED,
                      description="Create a new category")
def create_category(category: CreateCategoryRequest) -> HTTPResponse:
    try:
        result = create_category_service(category)
        return HTTPResponse(
            status=status.HTTP_201_CREATED,
            message=result.get("message")
        )
    except ValueError as e:
        return HTTPResponse(
            status=status.HTTP_400_BAD_REQUEST,
            message=str(e)
        )


@category_router.get("/get_categories_list/",
                     status_code=status.HTTP_200_OK,
                     description="Get a list of all categories")
def get_categories_list() -> HTTPResponse:
    try:
        result = get_categories_list_service()
        return HTTPResponse(
            status=status.HTTP_200_OK,
            message=result.get("message"),
            data=result.get("data", None)
        )
    except ValueError as e:
        return HTTPResponse(
            status=status.HTTP_400_BAD_REQUEST,
            message=str(e)
        )

@category_router.delete("/delete_category/",
                        status_code=status.HTTP_200_OK,
                        description="Delete a category by id")
def delete_category(category_id: DeleteCategoryRequest):
    try:
        result = delete_category_service(category_id)
        return HTTPResponse(
            status=status.HTTP_200_OK,
            message=result.get("message")
        )
    except ValueError as e:
        return HTTPResponse(
            status=status.HTTP_400_BAD_REQUEST,
            message=str(e)
        )
