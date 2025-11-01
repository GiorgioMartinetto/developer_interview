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


class CreateCategoryRequest(BaseModel):
    name: str

class DeleteCategoryRequest(BaseModel):
    id: int