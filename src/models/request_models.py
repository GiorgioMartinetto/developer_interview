from pydantic import BaseModel


class CreateProductRequest(BaseModel):
    name: str
    price: float
    category_id: int
    tags: list[str]
    description: str