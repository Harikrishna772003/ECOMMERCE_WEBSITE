from flask import Blueprint, request, jsonify
import razorpay

from config import Config
from models.cart import Cart
from models.product import Product
from database.db import db

payment = Blueprint("payment", __name__)

client = razorpay.Client(
    auth=(Config.RAZORPAY_KEY_ID, Config.RAZORPAY_KEY_SECRET)
)


# ==========================
# Create Razorpay Order
# ==========================
@payment.route("/payment/create-order", methods=["POST"])
def create_order():

    data = request.get_json()

    user_id = data.get("user_id")

    # Coupon Discount (Optional)
    discount = float(data.get("discount", 0))

    if not user_id:
        return jsonify({
            "message": "User ID Required"
        }), 400

    cart_items = Cart.query.filter_by(
        user_id=user_id
    ).all()

    if len(cart_items) == 0:
        return jsonify({
            "message": "Cart is Empty"
        }), 400

    total = 0

    for item in cart_items:

        product = db.session.get(Product, item.product_id)

        if product:

            total += product.price * item.quantity

    # ==========================
    # Apply Coupon Discount
    # ==========================
    final_amount = total - discount

    if final_amount < 0:
        final_amount = 0

    razorpay_order = client.order.create({

        "amount": int(final_amount * 100),

        "currency": "INR",

        "payment_capture": 1

    })

    return jsonify({

        "order_id": razorpay_order["id"],

        "amount": razorpay_order["amount"],

        "currency": razorpay_order["currency"],

        "key": Config.RAZORPAY_KEY_ID,

        "total": total,

        "discount": discount,

        "final_amount": final_amount

    })


# ==========================
# Verify Razorpay Payment
# ==========================
@payment.route("/payment/verify", methods=["POST"])
def verify_payment():

    data = request.get_json()

    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_signature = data.get("razorpay_signature")

    try:

        client.utility.verify_payment_signature({

            "razorpay_order_id": razorpay_order_id,

            "razorpay_payment_id": razorpay_payment_id,

            "razorpay_signature": razorpay_signature

        })

        return jsonify({

            "success": True,

            "message": "Payment Verified Successfully"

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 400