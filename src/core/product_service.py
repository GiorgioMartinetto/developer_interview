from src.entities.product_crud import create_product
from src.models.request_models import CreateProductRequest


def create_product_service(product: CreateProductRequest) -> dict:
    if product.price < 0:
        raise ValueError("Price cannot be negative")

    try:
        create_product(product)

        return {"message": "Product created successfully"}
    except Exception as e:
        raise ValueError(str(e)) from e
