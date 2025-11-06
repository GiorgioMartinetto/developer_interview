from typing import Literal

from pydantic import BaseModel


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
        min_max_price_filter: Literal["min", "max"] | None
        sort_by: tuple[Literal["price", "date"], Literal["asc", "desc"]] | None


class CreateCategoryRequest(BaseModel):
    name: str

class DeleteCategoryRequest(BaseModel):
    id: int