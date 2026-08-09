from flask import Blueprint, request, jsonify

from database.db import db
from models.order import Order
from models.order_item import OrderItem
from models.cart import Cart
from models.product import Product
from models.user import User

from services.email_service import send_order_email


order = Blueprint("order", __name__)


# ==========================
# Place Order
# ==========================

@order.route("/order/place", methods=["POST"])
def place_order():

    data = request.get_json()

    user_id = data.get("user_id")
    shipping_address = data.get("shipping_address")
    payment_method = data.get("payment_method")

    coupon_code = data.get("coupon_code")
    discount = float(data.get("discount", 0))
    final_amount = data.get("final_amount")

    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_signature = data.get("razorpay_signature")

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

    # ==========================
    # Validate Stock
    # ==========================

    for item in cart_items:

        product = db.session.get(
            Product,
            item.product_id
        )

        if not product:
            continue

        if product.stock <= 0:
            return jsonify({
                "message": f"{product.name} is Out of Stock"
            }), 400

        if item.quantity > product.stock:
            return jsonify({
                "message": f"Only {product.stock} unit(s) of {product.name} available"
            }), 400

        total += product.price * item.quantity

    # ==========================
    # Calculate Final Amount
    # ==========================

    if final_amount is None:
        final_amount = total - discount

    if final_amount < 0:
        final_amount = 0

    # ==========================
    # Create Order
    # ==========================

    new_order = Order(

        user_id=user_id,

        total_amount=total,

        coupon_code=coupon_code,

        discount=discount,

        final_amount=final_amount,

        shipping_address=shipping_address,

        payment_method=payment_method,

        status="Pending",

        shipment_status="Order Placed",

        razorpay_order_id=razorpay_order_id,

        razorpay_payment_id=razorpay_payment_id,

        razorpay_signature=razorpay_signature

    )

    db.session.add(new_order)

    db.session.flush()

    # ==========================
    # Save Order Items
    # ==========================

    for item in cart_items:

        product = db.session.get(
            Product,
            item.product_id
        )

        if not product:
            continue

        order_item = OrderItem(

            order_id=new_order.id,

            product_id=product.id,

            quantity=item.quantity,

            price=product.price,

            product_name=product.name,

            product_image=product.image

        )

        db.session.add(order_item)

        # Reduce stock
        product.stock -= item.quantity

    # ==========================
    # Clear Cart
    # ==========================

    for item in cart_items:
        db.session.delete(item)

    db.session.commit()

    # ==========================
    # Send Order Email
    # ==========================

    try:

        user = db.session.get(
            User,
            user_id
        )

        if user:

            send_order_email(
                user.email,
                user.full_name,
                new_order
            )

    except Exception as e:

        print("Email Error:", e)

    return jsonify({

        "message": "Order Placed Successfully",

        "order_id": new_order.id,

        "total_amount": total,

        "discount": discount,

        "final_amount": final_amount,

        "coupon_code": coupon_code

    }), 201


# ==========================
# Get User Orders
# ==========================

@order.route(
    "/orders/<int:user_id>",
    methods=["GET"]
)
def get_orders(user_id):

    orders = Order.query.filter_by(
        user_id=user_id
    ).order_by(
        Order.id.desc()
    ).all()

    result = []

    for order_item in orders:

        result.append({

            "id": order_item.id,

            "total_amount": order_item.total_amount,

            "discount": order_item.discount,

            "final_amount": order_item.final_amount,

            "coupon_code": order_item.coupon_code,

            "shipping_address": order_item.shipping_address,

            "payment_method": order_item.payment_method,

            "status": order_item.status,

            "shipment_status": order_item.shipment_status,

            "order_date": str(
                order_item.order_date
            ),

            "razorpay_order_id":
                order_item.razorpay_order_id,

            "razorpay_payment_id":
                order_item.razorpay_payment_id,

            "razorpay_signature":
                order_item.razorpay_signature

        })

    return jsonify(result), 200


# ==========================
# Get Order Details
# ==========================

@order.route(
    "/order/details/<int:order_id>",
    methods=["GET"]
)
def get_order_details(order_id):

    order_data = db.session.get(
        Order,
        order_id
    )

    if not order_data:

        return jsonify({
            "message": "Order Not Found"
        }), 404

    order_items = OrderItem.query.filter_by(
        order_id=order_id
    ).all()

    items = []

    for item in order_items:

        items.append({

            "product_id": item.product_id,

            "product_name": item.product_name,

            "product_image": item.product_image,

            "price": item.price,

            "quantity": item.quantity,

            "subtotal":
                item.price * item.quantity

        })

    return jsonify({

        "order": {

            "id": order_data.id,

            "status": order_data.status,

            "shipment_status":
                order_data.shipment_status,

            "payment_method":
                order_data.payment_method,

            "shipping_address":
                order_data.shipping_address,

            "coupon_code":
                order_data.coupon_code,

            "discount":
                order_data.discount,

            "total_amount":
                order_data.total_amount,

            "final_amount":
                order_data.final_amount,

            "order_date":
                str(order_data.order_date)

        },

        "items": items

    }), 200