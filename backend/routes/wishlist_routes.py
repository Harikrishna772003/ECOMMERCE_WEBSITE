from flask import Blueprint, request, jsonify

from database.db import db
from models.wishlist import Wishlist
from models.product import Product


wishlist = Blueprint("wishlist", __name__)


# ============================================================
# ADD TO WISHLIST
# ============================================================

@wishlist.route("/wishlist/add", methods=["POST"])
def add_to_wishlist():

    data = request.get_json()

    user_id = data.get("user_id")
    product_id = data.get("product_id")

    if not user_id or not product_id:

        return jsonify({
            "message": "user_id and product_id are required"
        }), 400

    # --------------------------------------------------------
    # Check product exists
    # --------------------------------------------------------

    product = db.session.get(
        Product,
        product_id
    )

    if not product:

        return jsonify({
            "message": "Product Not Found"
        }), 404

    # --------------------------------------------------------
    # Check duplicate wishlist item
    # --------------------------------------------------------

    existing = Wishlist.query.filter_by(
        user_id=user_id,
        product_id=product_id
    ).first()

    if existing:

        return jsonify({
            "message": "Product already exists in wishlist"
        }), 409

    # --------------------------------------------------------
    # Create wishlist item
    # --------------------------------------------------------

    item = Wishlist(
        user_id=user_id,
        product_id=product_id
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({
        "message": "Added to wishlist",
        "wishlist_id": item.id,
        "product_id": product_id
    }), 201


# ============================================================
# GET WISHLIST
# ============================================================

@wishlist.route("/wishlist/<int:user_id>", methods=["GET"])
def get_wishlist(user_id):

    items = Wishlist.query.filter_by(
        user_id=user_id
    ).all()

    result = []

    for item in items:

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

                "stock": product.stock

            })

    return jsonify(result), 200


# ============================================================
# REMOVE FROM WISHLIST
# ============================================================

@wishlist.route("/wishlist/remove/<int:id>", methods=["DELETE"])
def remove_wishlist(id):

    item = db.session.get(
        Wishlist,
        id
    )

    if not item:

        return jsonify({

            "message": "Item Not Found"

        }), 404

    db.session.delete(item)

    db.session.commit()

    return jsonify({

        "message": "Removed Successfully"

    }), 200