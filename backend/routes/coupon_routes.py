from flask import Blueprint, request, jsonify
from datetime import date

from models.coupon import Coupon

coupon = Blueprint("coupon", __name__)


# ==========================
# Validate Coupon
# ==========================
@coupon.route("/coupon/apply", methods=["POST"])
def apply_coupon():

    data = request.get_json()

    code = data.get("code", "").upper()
    total = float(data.get("total", 0))

    coupon = Coupon.query.filter_by(
        code=code,
        is_active=True
    ).first()

    if not coupon:
        return jsonify({
            "success": False,
            "message": "Invalid Coupon"
        }), 400

    if coupon.expiry_date < date.today():
        return jsonify({
            "success": False,
            "message": "Coupon Expired"
        }), 400

    if total < coupon.minimum_amount:
        return jsonify({
            "success": False,
            "message": f"Minimum order ₹{coupon.minimum_amount} required"
        }), 400

    if coupon.discount_type == "Percentage":

        discount = (total * coupon.discount_value) / 100

    else:

        discount = coupon.discount_value

    final_amount = total - discount

    if final_amount < 0:
        final_amount = 0

    return jsonify({

        "success": True,

        "coupon": coupon.code,

        "discount": discount,

        "final_amount": final_amount

    })