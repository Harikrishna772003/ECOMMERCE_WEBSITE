from flask import Blueprint, request, jsonify
from database.db import db
from models.review import Review
from models.user import User

review = Blueprint("review", __name__)


# ==========================
# Add Review
# ==========================
@review.route("/review/add", methods=["POST"])
def add_review():

    data = request.get_json()

    user_id = data.get("user_id")
    product_id = data.get("product_id")
    rating = data.get("rating")
    comment = data.get("comment")

    if not user_id or not product_id or not rating or not comment:
        return jsonify({
            "message": "All Fields are Required"
        }), 400

    # Prevent Duplicate Review
    existing_review = Review.query.filter_by(
        user_id=user_id,
        product_id=product_id
    ).first()

    if existing_review:
        return jsonify({
            "message": "You have already reviewed this product."
        }), 400

    new_review = Review(
        user_id=user_id,
        product_id=product_id,
        rating=rating,
        comment=comment
    )

    db.session.add(new_review)
    db.session.commit()

    return jsonify({
        "message": "Review Added Successfully"
    }), 201


# ==========================
# Get Product Reviews
# ==========================
@review.route("/reviews/<int:product_id>", methods=["GET"])
def get_reviews(product_id):

    reviews = Review.query.filter_by(
        product_id=product_id
    ).order_by(Review.created_at.desc()).all()

    review_list = []

    total_rating = 0

    for r in reviews:

        user = db.session.get(User, r.user_id)

        total_rating += r.rating

        review_list.append({

            "id": r.id,

            "user": user.full_name if user else "User",

            "rating": r.rating,

            "comment": r.comment,

            "date": r.created_at.strftime("%d-%m-%Y")

        })

    average_rating = 0

    if len(review_list) > 0:
        average_rating = round(
            total_rating / len(review_list),
            1
        )

    return jsonify({

        "average_rating": average_rating,

        "total_reviews": len(review_list),

        "reviews": review_list

    }), 200