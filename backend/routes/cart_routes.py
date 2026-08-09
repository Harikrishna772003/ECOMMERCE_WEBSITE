from flask import Blueprint, request, jsonify

from database.db import db
from models.cart import Cart
from models.product import Product


cart = Blueprint("cart", __name__)


# ==========================
# Add Product to Cart
# ==========================

@cart.route("/cart/add", methods=["POST"])
def add_to_cart():

    data = request.get_json()

    user_id = data.get("user_id")
    product_id = data.get("product_id")

    if not user_id or not product_id:
        return jsonify({
            "message": "User ID and Product ID are required"
        }), 400

    product = db.session.get(Product, product_id)

    if not product:
        return jsonify({
            "message": "Product not found"
        }), 404

    if product.stock <= 0:
        return jsonify({
            "message": "Product is out of stock"
        }), 400

    cart_item = Cart.query.filter_by(
        user_id=user_id,
        product_id=product_id
    ).first()

    if cart_item:

        if cart_item.quantity >= product.stock:
            return jsonify({
                "message": "Available stock limit reached"
            }), 400

        cart_item.quantity += 1

    else:

        cart_item = Cart(
            user_id=user_id,
            product_id=product_id,
            quantity=1
        )

        db.session.add(cart_item)

    db.session.commit()

    return jsonify({
        "message": "Product Added to Cart Successfully"
    }), 200


# ==========================
# Get User Cart
# ==========================

@cart.route("/cart/<int:user_id>", methods=["GET"])
def get_cart(user_id):

    cart_items = Cart.query.filter_by(
        user_id=user_id
    ).all()

    result = []

    for item in cart_items:

        product = db.session.get(
            Product,
            item.product_id
        )

        if product:

            result.append({

                "id": item.id,

                "product_id": product.id,

                "name": product.name,

                "description": product.description,

                "price": product.price,

                "image": product.image,

                "category": product.category,

                "stock": product.stock,

                "quantity": item.quantity

            })

    return jsonify(result), 200


# ==========================
# Remove Item From Cart
# ==========================

@cart.route(
    "/cart/remove/<int:cart_id>",
    methods=["DELETE"]
)
def remove_cart_item(cart_id):

    item = db.session.get(
        Cart,
        cart_id
    )

    if not item:

        return jsonify({
            "message": "Cart Item Not Found"
        }), 404

    db.session.delete(item)

    db.session.commit()

    return jsonify({
        "message": "Item Removed Successfully"
    }), 200


# ==========================
# Increase Quantity
# ==========================

@cart.route(
    "/cart/increase/<int:cart_id>",
    methods=["PUT"]
)
def increase_quantity(cart_id):

    item = db.session.get(
        Cart,
        cart_id
    )

    if not item:

        return jsonify({
            "message": "Cart Item Not Found"
        }), 404

    product = db.session.get(
        Product,
        item.product_id
    )

    if not product:

        return jsonify({
            "message": "Product Not Found"
        }), 404

    if product.stock <= 0:

        return jsonify({
            "message": "Product is out of stock"
        }), 400

    if item.quantity >= product.stock:

        return jsonify({
            "message": "Available stock limit reached"
        }), 400

    item.quantity += 1

    db.session.commit()

    return jsonify({
        "message": "Quantity Increased Successfully"
    }), 200


# ==========================
# Decrease Quantity
# ==========================

@cart.route(
    "/cart/decrease/<int:cart_id>",
    methods=["PUT"]
)
def decrease_quantity(cart_id):

    item = db.session.get(
        Cart,
        cart_id
    )

    if not item:

        return jsonify({
            "message": "Cart Item Not Found"
        }), 404

    if item.quantity > 1:

        item.quantity -= 1

    else:

        db.session.delete(item)

    db.session.commit()

    return jsonify({
        "message": "Quantity Updated Successfully"
    }), 200


# ==========================
# Cart Count
# ==========================

@cart.route(
    "/cart/count/<int:user_id>",
    methods=["GET"]
)
def cart_count(user_id):

    count = Cart.query.filter_by(
        user_id=user_id
    ).count()

    return jsonify({
        "count": count
    }), 200