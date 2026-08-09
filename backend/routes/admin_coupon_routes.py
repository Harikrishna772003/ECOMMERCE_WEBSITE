from flask import Blueprint, request, jsonify
from datetime import datetime

from database.db import db
from models.coupon import Coupon

admin_coupon = Blueprint("admin_coupon", __name__)


# ==========================
# Get All Coupons
# ==========================
@admin_coupon.route("/admin/coupons", methods=["GET"])
def get_coupons():

    coupons = Coupon.query.order_by(Coupon.id.desc()).all()

    result = []

    for coupon in coupons:

        result.append({

            "id": coupon.id,
            "code": coupon.code,
            "discount_type": coupon.discount_type,
            "discount_value": coupon.discount_value,
            "minimum_amount": coupon.minimum_amount,
            "expiry_date": str(coupon.expiry_date),
            "is_active": coupon.is_active

        })

    return jsonify(result), 200


# ==========================
# Add Coupon
# ==========================
@admin_coupon.route("/admin/coupon", methods=["POST"])
def add_coupon():

    data = request.get_json()

    code = data.get("code").upper()

    if Coupon.query.filter_by(code=code).first():

        return jsonify({
            "message": "Coupon Already Exists"
        }), 400

    coupon = Coupon(

        code=code,

        discount_type=data.get("discount_type"),

        discount_value=data.get("discount_value"),

        minimum_amount=data.get("minimum_amount"),

        expiry_date=datetime.strptime(
            data.get("expiry_date"),
            "%Y-%m-%d"
        ).date(),

        is_active=data.get("is_active", True)

    )

    db.session.add(coupon)

    db.session.commit()

    return jsonify({
        "message": "Coupon Created Successfully"
    }), 201


# ==========================
# Update Coupon
# ==========================
@admin_coupon.route("/admin/coupon/<int:id>", methods=["PUT"])
def update_coupon(id):

    coupon = Coupon.query.get(id)

    if not coupon:

        return jsonify({
            "message": "Coupon Not Found"
        }), 404

    data = request.get_json()

    coupon.code = data.get("code").upper()
    coupon.discount_type = data.get("discount_type")
    coupon.discount_value = data.get("discount_value")
    coupon.minimum_amount = data.get("minimum_amount")
    coupon.expiry_date = datetime.strptime(
        data.get("expiry_date"),
        "%Y-%m-%d"
    ).date()
    coupon.is_active = data.get("is_active")

    db.session.commit()

    return jsonify({
        "message": "Coupon Updated Successfully"
    })


# ==========================
# Delete Coupon
# ==========================
@admin_coupon.route("/admin/coupon/<int:id>", methods=["DELETE"])
def delete_coupon(id):

    coupon = Coupon.query.get(id)

    if not coupon:

        return jsonify({
            "message": "Coupon Not Found"
        }), 404

    db.session.delete(coupon)

    db.session.commit()

    return jsonify({
        "message": "Coupon Deleted Successfully"
    })