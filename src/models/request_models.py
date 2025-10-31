from pydantic import BaseModel


class CreateProductRequest(BaseModel):
    name: str
    price: float
    category_id: int
    tags: list[str]
    description: str


class UpdateProductRequest(BaseModel):
    id: int
    name: str | None
    price: float | None
    category_id: int | None
    tags: list[str] | None
    description: str | None


class CreateCategoryRequest(BaseModel):
    name: str