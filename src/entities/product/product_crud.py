from datetime import datetime

from loguru import logger
from thefuzz import fuzz

from src.database.database_instance.db_instance import db_session
from src.entities.category.category_entity import Category
from src.entities.product.product_entity import Product
from src.models.request_models import (
    CreateProductRequest,
    DeleteProductRequest,
    GetFilteredProductsRequest,
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

def get_products_list(page: int, page_size: int) -> list[dict]:
    try:
        products = db_session.query(Product).all()

        return _convert_products_to_dict(products=products)
    except Exception as e:
        logger.exception(f"Error getting products list: {e}")
        raise RuntimeError("Failed to get products list") from e

def get_filtered_products(product_filter: GetFilteredProductsRequest) -> tuple[list[dict], int]:
    try:
        query = db_session.query(Product)
        if product_filter.category_filter:
            query = query.filter(Product.category_id.any(Category.name.in_(product_filter.category_filter)))

        # sostituire nel corpo di `get_filtered_products`
        if product_filter.min_max_price_filter:
            try:
                min_price, max_price = product_filter.min_max_price_filter
            except Exception:
                min_price, max_price = None, None

            def _to_num(v):
                try:
                    return float(v) if v is not None else None
                except Exception:
                    return None

            min_price = _to_num(min_price)
            max_price = _to_num(max_price)

            if min_price is not None and max_price is not None:
                query = query.filter(Product.price >= min_price, Product.price <= max_price)
            elif min_price is not None:
                query = query.filter(Product.price >= min_price)
            elif max_price is not None:
                query = query.filter(Product.price <= max_price)


        if product_filter.sort_by:
            field, direction = product_filter.sort_by
            if field == "price":
                if direction == "asc":
                    query = query.order_by(Product.price.asc())
                else:
                    query = query.order_by(Product.price.desc())

            elif field == "date":
                if direction == "asc":
                    query = query.order_by(Product.created_at.asc())
                else:
                    query = query.order_by(Product.created_at.desc())

        # Get total count before applying pagination
        total_count = query.count()

        # Apply pagination
        offset = (product_filter.page - 1) * product_filter.page_size
        query = query.offset(offset).limit(product_filter.page_size)

        results = query.all()

        if product_filter.text_filter:
            results = sorted(
                results,
                key=lambda prod: fuzz.partial_ratio(product_filter.text_filter.lower(), prod.name.lower()),
                reverse=True
            )
            results = [r for r in results if fuzz.partial_ratio(product_filter.text_filter.lower(), r.name.lower()) > 60]

        return _convert_products_to_dict(products=results), total_count

    except Exception as e:
        logger.exception(f"Error getting filtered products: {e}")
        raise RuntimeError("Failed to get filtered products") from e


def _convert_products_to_dict(products: list[Product]) -> list[dict]:
    if not products:
        return []

    products_dicts = []
    for product in products:
        if hasattr(product, "__table__"):
            prod_dict = {col.name: getattr(product, col.name) for col in product.__table__.columns}
        else:
            prod_dict = {
                k: v for k, v in product.__dict__.items() if k != "_sa_instance_state"
            }

        if hasattr(product, "category_id") and product.category_id is not None:
            try:
                prod_dict["categories"] = [
                    {col.name: getattr(c, col.name) for col in c.__table__.columns}
                    for c in product.category_id
                ]
            except Exception as _:
                prod_dict["categories"] = prod_dict.get("category_id")
            prod_dict.pop("category_id", None)

        products_dicts.append(prod_dict)

    return products_dicts

def get_number_of_product():
    try:
        number_of_products = db_session.query(Product).count()
        return number_of_products
    except Exception as e:
        logger.exception(f"Error getting number of products: {e}")
        raise RuntimeError("Failed to get number of products") from e
