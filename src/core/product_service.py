
from src.entities.product.product_crud import (
    create_product,
    delete_product,
    get_filtered_products,
    get_number_of_product,
    get_product_by_id,
    get_products_list,
    update_product,
)
from src.models.request_models import (
    CreateProductRequest,
    DeleteProductRequest,
    GetFilteredProductsRequest,
    GetProductRequest,
    UpdateProductRequest,
)


def create_product_service(product: CreateProductRequest) -> dict:
    if product.price < 0:
        raise ValueError("Price cannot be negative")
    try:
        create_product(product=product)
        return {"message": "Product created successfully"}
    except Exception as e:
        raise ValueError(str(e)) from e


def update_product_service(product: UpdateProductRequest) -> dict:
    product_dict = {key: value for key, value in product.__dict__.items() if value is not None}

    if product_dict.get("price") and product_dict.get("price") < 0:
        raise ValueError("Price cannot be negative")
    try:
        update_product(product=product_dict)
        return {"message": "Product updated successfully"}
    except Exception as e:
        raise ValueError(str(e)) from e


def delete_product_service(product: DeleteProductRequest) -> dict:
    try:
        delete_product(product=product)
        return {"message": "Product deleted successfully"}
    except Exception as e:
        raise ValueError(str(e)) from e


def get_product_service(product: GetProductRequest) -> dict:
    try:
        product_instance = get_product_by_id(product=product)
        if not product_instance:
            raise ValueError("Product not found")
        return {"message": "Product retrieved successfully", "data": product_instance}
    except Exception as e:
        raise ValueError(str(e)) from e

def get_products_list_service() -> dict:
    try:
        products = get_products_list()
        return {
            "message": "Products list retrieved successfully",
            "data": products
        }
    except Exception as e:
        raise ValueError(str(e)) from e

def get_filtered_products_service(product_filter: GetFilteredProductsRequest) -> dict:
    try:
        products = get_filtered_products(product_filter=product_filter)
        if not products:
            return {
                "message": "No products found",
                "data": []
            }
        return {
            "message": "Filtered products list retrieved successfully",
            "data": products
        }
    except Exception as e:
        raise ValueError(str(e)) from e

def get_number_of_product_service() -> dict:
    try:
        number_of_products = get_number_of_product()
        return {
            "message": "Number of products retrieved successfully",
            "data": number_of_products
        }
    except Exception as e:
        raise ValueError(str(e)) from e