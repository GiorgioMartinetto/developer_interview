from datetime import datetime

from loguru import logger

from src.database.database_instance.db_instance import db_session
from src.entities.category.category_entity import Category
from src.entities.product.product_entity import Product
from src.models.request_models import (
    CreateProductRequest,
    DeleteProductRequest,
    GetProductRequest,
)


def create_product(product: CreateProductRequest):
    product_categories = []
    if product.categories_name:
        for category_name in product.categories_name:
            category = (
                db_session.query(Category)
                .filter(Category.name.ilike(category_name))
                .first()
            )
            if not category:
                raise ValueError(f"Category '{category_name}' not found")
            product_categories.append(category)

    try:
        product_instance = Product(
            name = product.name,
            price = product.price,
            tags = product.tags,
            created_at = datetime.now().strftime("%d/%m/%Y"),
            description = product.description,
        )

        if product_categories:
            product_instance.category_id.extend(product_categories)

        db_session.add(product_instance)
        db_session.commit()
        db_session.refresh(product_instance)
        logger.success("Product created successfully")

    except Exception as e:
        db_session.rollback()
        logger.exception(f"Error creating product: {e}")
        raise RuntimeError("Failed to create product") from e

def update_product(product: dict):
    try:
        product_instance = db_session.query(Product).filter(Product.id == product.get("id")).first()
        logger.info(product_instance)
        logger.info(product)
        if not product_instance:
            raise ValueError("Product not found")

        for key, value in product.items():
            if key.lower() == "id":
                continue

            if key == "categories_name" and value is not None:
                product_categories = []
                for category_name in value:
                    category = (
                        db_session.query(Category)
                        .filter(Category.name.ilike(category_name))
                        .first()
                    )
                    if not category:
                        raise ValueError(f"Category '{category_name}' not found")
                    product_categories.append(category)
                product_instance.category_id = product_categories
            elif value is not None and hasattr(product_instance, key):
                setattr(product_instance, key, value)

        db_session.commit()
        db_session.refresh(product_instance)
        logger.success("Product updated successfully")

    except Exception as e:
        db_session.rollback()
        logger.exception(f"Error updating product: {e}")
        raise RuntimeError("Failed to update product") from e

def delete_product(product: DeleteProductRequest):
    try:
        product_instance = db_session.query(Product).filter(Product.id == product.id).first()
        if not product_instance:
            raise ValueError("Product not found")
        db_session.delete(product_instance)
        db_session.commit()
        logger.success("Product deleted successfully")
    except Exception as e:
        db_session.rollback()
        logger.exception(f"Error deleting product: {e}")
        raise RuntimeError("Failed to delete product") from e

def get_product_by_id(product: GetProductRequest):
    try:
        product_instance = db_session.query(Product).filter(Product.id == product.id).first()
        return product_instance
    except Exception as e:
        logger.exception(f"Error getting product: {e}")
        raise RuntimeError("Failed to get product") from e

def get_products_list():
    try:
        products = db_session.query(Product).all()
        products_dicts = []
        for p in products:
            if hasattr(p, "__table__"):
                prod_dict = {col.name: getattr(p, col.name) for col in p.__table__.columns}
            else:
                prod_dict = {k: v for k, v in p.__dict__.items() if k != "_sa_instance_state"}

            if hasattr(p, "category_id") and p.category_id is not None:
                try:
                    prod_dict["categories"] = [
                        {col.name: getattr(c, col.name) for col in c.__table__.columns} for c in p.category_id
                    ]
                except Exception:
                    prod_dict["categories"] = prod_dict.get("category_id")
                prod_dict.pop("category_id", None)

            products_dicts.append(prod_dict)

        return products_dicts
    except Exception as e:
        logger.exception(f"Error getting products list: {e}")
        raise RuntimeError("Failed to get products list") from e