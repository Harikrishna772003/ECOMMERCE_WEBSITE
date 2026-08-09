from flask import Blueprint, jsonify, request

from database.db import db
from models.order import Order
from models.notification import Notification

admin_order = Blueprint("admin_order", __name__)


# ==========================
# Get All Orders
# ==========================
@admin_order.route("/admin/orders", methods=["GET"])
def get_all_orders():

    orders = Order.query.order_by(
        Order.id.desc()
    ).all()

    data = []

    for order in orders:

        data.append({

            "id": order.id,

            "user_id": order.user_id,

            "total_amount": order.total_amount,

            "final_amount": order.final_amount,

            "shipping_address": order.shipping_address,

            "payment_method": order.payment_method,

            "status": order.status,

            "shipment_status": order.shipment_status,

            "order_date": str(order.order_date)

        })

    return jsonify(data), 200


# ==========================
# Update Payment Status
# ==========================
@admin_order.route("/admin/order/<int:id>", methods=["PUT"])
def update_order_status(id):

    order = Order.query.get(id)

    if not order:

        return jsonify({
            "message": "Order Not Found"
        }), 404

    data = request.get_json()

    order.status = data.get(
        "status",
        order.status
    )

    db.session.commit()

    return jsonify({

        "message": "Payment Status Updated Successfully"

    }), 200


# ==========================
# Update Shipment Status
# ==========================
@admin_order.route(
    "/admin/order/shipment/<int:id>",
    methods=["PUT"]
)
def update_shipment_status(id):

    order = Order.query.get(id)

    if not order:

        return jsonify({
            "message": "Order Not Found"
        }), 404

    data = request.get_json()

    shipment_status = data.get(
        "shipment_status",
        order.shipment_status
    )

    order.shipment_status = shipment_status

    # ==========================
    # Auto Update Payment Status
    # ==========================
    if shipment_status == "Order Placed":
        order.status = "Pending"

    elif shipment_status == "Packed":
        order.status = "Processing"

    elif shipment_status == "Shipped":
        order.status = "Shipped"

    elif shipment_status == "Out for Delivery":
        order.status = "Out for Delivery"

    elif shipment_status == "Delivered":
        order.status = "Delivered"

    # ==========================
    # Create Notification
    # ==========================
    notification = Notification(

        user_id=order.user_id,

        title="Shipment Update",

        message=f"Your Order #{order.id} is now {shipment_status}."

    )

    db.session.add(notification)

    db.session.commit()

    return jsonify({

        "message": "Shipment Status Updated Successfully"

    }), 200