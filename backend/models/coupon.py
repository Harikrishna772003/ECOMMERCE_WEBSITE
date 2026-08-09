from database.db import db


class Coupon(db.Model):

    __tablename__ = "coupons"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    code = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    discount_type = db.Column(
        db.String(20),
        nullable=False
    )
    # Values:
    # Percentage
    # Flat

    discount_value = db.Column(
        db.Float,
        nullable=False
    )

    minimum_amount = db.Column(
        db.Float,
        default=0
    )

    expiry_date = db.Column(
        db.Date,
        nullable=False
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )