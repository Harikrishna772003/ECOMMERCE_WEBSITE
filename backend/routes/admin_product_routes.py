from flask import Blueprint, request, jsonify

from database.db import db
from models.product import Product

admin_product = Blueprint("admin_product", __name__)


# ==========================
# Get All Products
# ==========================
@admin_product.route("/admin/products", methods=["GET"])
def get_all_products():

    products = Product.query.all()

    data = []

    for product in products:

        # Inventory Status
        if product.stock == 0:
            status = "Out Of Stock"

        elif product.stock <= 5:
            status = "Low Stock"

        else:
            status = "In Stock"

        data.append({

            "id": product.id,

            "name": product.name,

            "price": product.price,

            "description": product.description,

            "category": product.category,

            "stock": product.stock,

            "image": product.image,

            "status": status

        })

    return jsonify(data), 200


# ==========================
# Low Stock Products
# ==========================
@admin_product.route("/admin/products/low-stock", methods=["GET"])
def low_stock_products():

    products = Product.query.filter(
        Product.stock <= 5
    ).all()

    result = []

    for product in products:

        result.append({

            "id": product.id,

            "name": product.name,

            "stock": product.stock,

            "image": product.image,

            "category": product.category

        })

    return jsonify(result), 200


# ==========================
# Add Product
# ==========================
@admin_product.route("/admin/product", methods=["POST"])
def add_product():

    data = request.get_json()

    product = Product(

        name=data.get("name"),

        price=data.get("price"),

        description=data.get("description"),

        category=data.get("category"),

        stock=data.get("stock"),

        image=data.get("image")

    )

    db.session.add(product)

    db.session.commit()

    return jsonify({

        "message": "Product Added Successfully"

    }), 201


# ==========================
# Update Product
# ==========================
@admin_product.route("/admin/product/<int:id>", methods=["PUT"])
def update_product(id):

    product = Product.query.get(id)

    if not product:

        return jsonify({

            "message": "Product Not Found"

        }), 404

    data = request.get_json()

    product.name = data.get("name")

    product.price = data.get("price")

    product.description = data.get("description")

    product.category = data.get("category")

    product.stock = data.get("stock")

    product.image = data.get("image")

    db.session.commit()

    return jsonify({

        "message": "Product Updated Successfully"

    })


# ==========================
# Delete Product
# ==========================
@admin_product.route("/admin/product/<int:id>", methods=["DELETE"])
def delete_product(id):

    product = Product.query.get(id)

    if not product:

        return jsonify({

            "message": "Product Not Found"

        }), 404

    db.session.delete(product)

    db.session.commit()

    return jsonify({

        "message": "Product Deleted Successfully"

    })