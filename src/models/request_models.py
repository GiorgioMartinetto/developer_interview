from typing import Literal

from pydantic import BaseModel


# Product-related request models
# These models handle requests for creating, updating, deleting, retrieving single products, and filtering products
class CreateProductRequest(BaseModel):
    name: str
    price: float
    categories_name: list[str] | None
    tags: list[str] | None
    description: str

class UpdateProductRequest(BaseModel):
    id: int
    name: str | None
    price: float | None
    categories_name: list[str] | None
    tags: list[str] | None
    description: str | None

class DeleteProductRequest(BaseModel):
    id: int


class GetProductRequest(BaseModel):
    id: int


class GetFilteredProductsRequest(BaseModel):
        text_filter: str | None
        category_filter: list[str] | None
        min_max_price_filter: tuple[float, float] | None
        sort_by: tuple[Literal["price", "date"], Literal["asc", "desc"]] | None
        page: int = 1
        page_size: int = 5


# Category-related request models
# These models handle requests for creating and deleting categories
class CreateCategoryRequest(BaseModel):
    name: str

class DeleteCategoryRequest(BaseModel):
    id: int


class ChatRequest(BaseModel):
    message: str
