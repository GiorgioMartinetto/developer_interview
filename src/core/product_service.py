
from src.entities.product_crud import create_product, update_product
from src.models.request_models import CreateProductRequest, UpdateProductRequest


def create_product_service(product: CreateProductRequest) -> dict:
    if product.price < 0:
        raise ValueError("Price cannot be negative")

    try:
        create_product(product)

        return {"message": "Product created successfully"}
    except Exception as e:
        raise ValueError(str(e)) from e


def update_product_service(product: UpdateProductRequest) -> dict:
    product_dict = {key: value for key, value in product.__dict__.items() if value is not None}

    if product_dict.get("price") and product_dict.get("price") < 0:
        raise ValueError("Price cannot be negative")
    try:
        update_product(product_dict)
        return {"message": "Product updated successfully"}
    except Exception as e:
        raise ValueError(str(e)) from e