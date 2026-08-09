from flask import Blueprint, jsonify

from database.db import db
from models.review import Review
from models.user import User
from models.product import Product

admin_review = Blueprint("admin_review", __name__)
# ==========================
# Get All Reviews
# ==========================
@admin_review.route("/admin/reviews", methods=["GET"])
def get_all_reviews():

    reviews = Review.query.order_by(
        Review.id.desc()
    ).all()

    result = []

    for r in reviews:

        user = db.session.get(User, r.user_id)

        product = db.session.get(Product, r.product_id)

        result.append({

            "id": r.id,

            "user_name": user.full_name if user else "User",

            "product_name": product.name if product else "Deleted Product",

            "rating": r.rating,

            "comment": r.comment,

            "date": str(r.created_at)

        })

    return jsonify(result), 200
    # ==========================
# Delete Review
# ==========================
@admin_review.route("/admin/review/delete/<int:review_id>", methods=["DELETE"])
def delete_review(review_id):

    review = db.session.get(Review, review_id)

    if not review:
        return jsonify({
            "message": "Review Not Found"
        }), 404

    db.session.delete(review)
    db.session.commit()

    return jsonify({
        "message": "Review Deleted Successfully"
    }), 200