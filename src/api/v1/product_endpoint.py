from fastapi import APIRouter, status

from src.core.product_service import create_product_service, update_product_service
from src.models.request_models import CreateProductRequest, UpdateProductRequest
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

@product_router.get("/get_product_by_id/", description="Get a product by id")
def get_product():
    pass

@product_router.put("/update_product/",
                    status_code= status.HTTP_200_OK,
                    description="Update a product by id")
def update_product(product: UpdateProductRequest):
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

@product_router.delete("/delete_product/", description="Delete a product by id")
def delete_product():
    pass

@product_router.get("/filtered_products/", description="Get filtered products")
def filtered_products():
    pass