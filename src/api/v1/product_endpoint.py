from fastapi import APIRouter, status

from src.core.product_service import (
    create_product_service,
    delete_product_service,
    get_product_service,
    get_products_list_service,
    update_product_service,
)
from src.models.request_models import (
    CreateProductRequest,
    DeleteProductRequest,
    GetProductRequest,
    UpdateProductRequest,
)
from src.models.response_models import HTTPResponse

product_router = APIRouter(
    prefix="/v1/product",
    tags=["product"]
)


@product_router.post("/create_product/",
             status_code=status.HTTP_201_CREATED,
             description="Create a new product")
def create_product(product: CreateProductRequest) -> HTTPResponse:
    try:
        result = create_product_service(product)
        return HTTPResponse(
            status=status.HTTP_201_CREATED,
            message=result.get("message")
        )
    except ValueError as e:
        return HTTPResponse(
            status=status.HTTP_400_BAD_REQUEST,
            message=str(e)
        )


@product_router.get("/get_product_by_id/",
                    status_code=status.HTTP_200_OK,
                    description="Get a product by id")
def get_product(product: GetProductRequest):
    try:
        result = get_product_service(product)
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


@product_router.put("/update_product/",
                    status_code= status.HTTP_200_OK,
                    description="Update a product by id")
def update_product(product: UpdateProductRequest) -> HTTPResponse:
    #TODO: Controllare che l'update funzioni correttamente per la parte dei tags
    try:
        result = update_product_service(product)
        return HTTPResponse(
            status=status.HTTP_200_OK,
            message=result.get("message")
        )
    except ValueError as e:
        return HTTPResponse(
            status=status.HTTP_400_BAD_REQUEST,
            message=str(e)
        )



@product_router.delete("/delete_product/",
                       status_code=status.HTTP_200_OK,
                       description="Delete a product by id")
def delete_product(product: DeleteProductRequest):
    try:
        result = delete_product_service(product)
        return HTTPResponse(
            status=status.HTTP_200_OK,
            message=result.get("message")
        )
    except ValueError as e:
        return HTTPResponse(
            status=status.HTTP_400_BAD_REQUEST,
            message=str(e)
        )


@product_router.get("/filtered_products/", description="Get filtered products")
def filtered_products():
    pass


@product_router.get("/get_products_list/",
                    status_code=status.HTTP_200_OK,
                    description="Get a list of all products")
def get_products_list() -> HTTPResponse:
    try:
        result = get_products_list_service()
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