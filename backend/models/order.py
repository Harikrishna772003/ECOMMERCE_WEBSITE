from database.db import db


class Order(db.Model):

    __tablename__ = "orders"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    # Original Cart Total
    total_amount = db.Column(
        db.Float,
        nullable=False
    )

    # Coupon Code Applied
    coupon_code = db.Column(
        db.String(50)
    )

    # Discount Amount
    discount = db.Column(
        db.Float,
        default=0
    )

    # Final Payable Amount
    final_amount = db.Column(
        db.Float,
        nullable=False
    )

    shipping_address = db.Column(
        db.Text,
        nullable=False
    )

    payment_method = db.Column(
        db.String(50),
        nullable=False
    )

    # Payment Status
    status = db.Column(
        db.String(30),
        default="Payment Pending"
    )

    # Shipment Tracking Status
    shipment_status = db.Column(
        db.String(50),
        default="Order Placed"
    )

    # Razorpay Details
    razorpay_order_id = db.Column(
        db.String(200)
    )

    razorpay_payment_id = db.Column(
        db.String(200)
    )

    razorpay_signature = db.Column(
        db.String(500)
    )

    order_date = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )